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

  function wrapper(): HTMLElement {
    return fixture.nativeElement.querySelector('.docspace-wrapper');
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

  it('sizes the wrapper from the config', () => {
    render({ width: '480px', height: '600px' });

    expect(wrapper().style.width).toBe('480px');
    expect(wrapper().style.height).toBe('600px');
  });

  it('falls back to filling its parent when no size is given', () => {
    render();

    expect(wrapper().style.width).toBe('100%');
    expect(wrapper().style.height).toBe('100%');
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
});
