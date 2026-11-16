/*
* (c) Copyright Ascensio System SIA 2026
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { SDKInstance } from '@onlyoffice/docspace-sdk-js/dist/types/instance';
import type { TFrameConfig } from '@onlyoffice/docspace-sdk-js/dist/types/types';

import { DocSpaceComponent } from './docspace.component';
import { DocSpaceSdk } from '../services/docspace-sdk.service';

const config: TFrameConfig = {
  frameId: 'ds-frame',
  src: 'https://portal.example.com',
  mode: 'manager',
};

describe('DocSpaceComponent', () => {
  let sdk: jasmine.SpyObj<DocSpaceSdk>;
  let instance: jasmine.SpyObj<SDKInstance>;
  let fixture: ComponentFixture<DocSpaceComponent>;

  /** Creates the component with `config`, and runs it up to ngAfterViewInit. */
  function render(overrides: Partial<TFrameConfig> = {}): ComponentFixture<DocSpaceComponent> {
    fixture = TestBed.createComponent(DocSpaceComponent);
    fixture.componentRef.setInput('config', { ...config, ...overrides });
    fixture.detectChanges();
    return fixture;
  }

  function host(): HTMLElement {
    return fixture.nativeElement;
  }

  beforeEach(() => {
    instance = jasmine.createSpyObj<SDKInstance>('SDKInstance', ['destroyFrame']);
    sdk = jasmine.createSpyObj<DocSpaceSdk>('DocSpaceSdk', ['initFrame']);
    sdk.initFrame.and.returnValue(instance);

    TestBed.configureTestingModule({
      imports: [DocSpaceComponent],
      providers: [provideZonelessChangeDetection(), { provide: DocSpaceSdk, useValue: sdk }],
    });
  });

  it('creates', () => {
    expect(render().componentInstance).toBeTruthy();
  });

  it('renders the element the SDK mounts the frame into', () => {
    render();

    expect(document.getElementById('ds-frame')).toBeTruthy();
  });

  it('renders the placeholder straight into a host that creates no box', () => {
    render({ width: '480px', height: '600px' });

    expect(host().children.length).toBe(1);
    expect(host().firstElementChild?.id).toBe('ds-frame');
    expect(getComputedStyle(host()).display).toBe('contents');
    expect(host().style.width).toBe('');
    expect(host().style.height).toBe('');
  });

  it('passes line-height 0 down to the frame container', () => {
    render();

    expect(getComputedStyle(host().firstElementChild!).lineHeight).toBe('0px');
  });

  it('initialises the frame once, with the given config', () => {
    render();

    expect(sdk.initFrame).toHaveBeenCalledTimes(1);
    expect(sdk.initFrame).toHaveBeenCalledWith(config);
  });

  it('hands the instance to setDocspaceInstance', () => {
    fixture = TestBed.createComponent(DocSpaceComponent);
    fixture.componentRef.setInput('config', config);

    const emitted: SDKInstance[] = [];
    fixture.componentInstance.setDocspaceInstance.subscribe((i) => emitted.push(i));

    fixture.detectChanges();

    expect(emitted).toEqual([instance]);
  });

  it('renders without a subscriber', () => {
    expect(() => render()).not.toThrow();
    expect(sdk.initFrame).toHaveBeenCalledTimes(1);
  });

  it('does not re-initialise when the config changes', () => {
    render();

    fixture.componentRef.setInput('config', { ...config, src: 'https://other.example.com' });
    fixture.detectChanges();

    expect(sdk.initFrame).toHaveBeenCalledTimes(1);
    expect(instance.destroyFrame).not.toHaveBeenCalled();
  });

  it('keeps the mount element id when the frameId changes', () => {
    render();

    fixture.componentRef.setInput('config', { ...config, frameId: 'other-frame' });
    fixture.detectChanges();

    expect(document.getElementById('ds-frame')).toBeTruthy();
    expect(document.getElementById('other-frame')).toBeNull();
  });

  it('destroys the frame when the component is destroyed', () => {
    render();

    fixture.destroy();

    expect(instance.destroyFrame).toHaveBeenCalledTimes(1);
  });

  it('does not open a frame outside a browser', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });

    render();

    expect(sdk.initFrame).not.toHaveBeenCalled();
  });

  // Sizing is left to the SDK, so its 100% default is checked against the real
  // one: a peer release that drops it would break the README's promise.
  describe('with the real SDK', () => {
    beforeEach(() => {
      TestBed.overrideProvider(DocSpaceSdk, { useFactory: () => new DocSpaceSdk() });
      // The SDK queries the portal on init; left pending, it neither hits the
      // network nor logs an SDK error.
      spyOn(window, 'fetch').and.returnValue(new Promise<Response>(() => undefined));
    });

    // Port 9 is on Chrome's blocked list, so the iframe fails without a request.
    const offline: Partial<TFrameConfig> = { src: 'http://127.0.0.1:9' };

    it('fills the parent when no size is given', () => {
      render(offline);

      const container = document.getElementById('ds-frame-container');
      expect(container?.style.width).toBe('100%');
      expect(container?.style.height).toBe('100%');
    });

    it('sizes the frame container from the config', () => {
      render({ ...offline, width: '480px', height: '600px' });

      const container = document.getElementById('ds-frame-container');
      expect(container?.style.width).toBe('480px');
      expect(container?.style.height).toBe('600px');
    });
  });
});
