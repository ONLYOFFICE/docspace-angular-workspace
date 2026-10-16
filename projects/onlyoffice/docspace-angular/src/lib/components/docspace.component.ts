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

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';

import type { SDKInstance } from '@onlyoffice/docspace-sdk-js/dist/types/instance';
import type { TFrameConfig } from '@onlyoffice/docspace-sdk-js/dist/types/types';

import { DocSpaceSdk } from '../services/docspace-sdk.service';

@Component({
  selector: 'docspace',
  // The SDK replaces the #frameId placeholder with its own container, so the
  // host element is the node Angular owns and removes on destroy. display:
  // contents gives it no box: the container is sized by the SDK from
  // config.width and config.height, against the element the component is
  // placed in, and the host never holds on to the size of the first render.
  //
  // line-height: 0 is still inherited by the container the SDK puts the frame
  // in. The frame is an iframe, an inline element, so it sits on a text
  // baseline and the line box adds the font's descender space (about 4px)
  // under it. With a frame asking for the full height of its box, those few
  // pixels are enough to overflow the parent and give the page a scrollbar.
  template: `<div [id]="frameId()"></div>`,
  styles: `
    :host {
      display: contents;
      line-height: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocSpaceComponent implements AfterViewInit, OnDestroy {
  /**
   * Generic configuration object for opening ONLYOFFICE Apps. Requires `src`,
   * the address of ONLYOFFICE Apps specified without a trailing slash, and
   * `frameId`, the id of the element the frame is mounted into.
   *
   * Applied when the component is initialised: a later change is not picked up,
   * see the note in `ngAfterViewInit`.
   *
   * @see https://api.onlyoffice.com/docspace/jssdk/config/
   */
  readonly config = input.required<TFrameConfig>();

  /**
   * Emits once, with the ONLYOFFICE Apps instance, as soon as the frame is
   * opened. The instance provides the API methods for working with ONLYOFFICE
   * Apps.
   */
  readonly setDocspaceInstance = output<SDKInstance>();

  // Untracked, so the computed has no dependencies and keeps the first value:
  // the SDK knows the frame by the id it was opened with, and the mount
  // element has to keep it for as long as the frame is open.
  protected readonly frameId = computed(() => untracked(this.config).frameId);

  private readonly sdk = inject(DocSpaceSdk);
  private readonly platformId = inject(PLATFORM_ID);

  private instance?: SDKInstance;

  ngAfterViewInit(): void {
    // The SDK looks the mount element up by id, so the view has to be in the
    // document already — which rules out ngOnInit. On the server there is no
    // document at all, and nothing for the frame to render into.
    if (!isPlatformBrowser(this.platformId)) return;

    // Read once: re-running this would destroy the frame and build a new one,
    // dropping whatever the user was doing in it. To change the configuration of
    // an open frame, use the instance's setConfig method, which is handed out
    // through setDocspaceInstance.
    this.instance = this.sdk.initFrame(this.config());
    this.setDocspaceInstance.emit(this.instance);
  }

  ngOnDestroy(): void {
    this.instance?.destroyFrame();
    this.instance = undefined;
  }
}
