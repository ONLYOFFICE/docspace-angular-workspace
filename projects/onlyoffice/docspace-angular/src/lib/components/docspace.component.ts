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
  // The SDK replaces the #frameId placeholder with its own container, sized from
  // config.width/height. display: contents keeps the host boxless, so percentages
  // resolve against the parent and the host never pins the first render's size.
  // line-height: 0 is inherited by that container: the iframe is inline, and the
  // descender space under its baseline (~4px) would overflow a 100%-high parent.
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
   * Generic configuration object for opening ONLYOFFICE Apps. Requires `src`
   * (without a trailing slash) and `frameId`, the id of the mount element.
   *
   * Read once, on init: re-applying it would rebuild the frame and drop the
   * user's state. Change an open frame through the instance's `setConfig`.
   *
   * @see https://api.onlyoffice.com/docspace/jssdk/config/
   */
  readonly config = input.required<TFrameConfig>();

  /** Emits once, with the ONLYOFFICE Apps instance, as soon as the frame is opened. */
  readonly setDocspaceInstance = output<SDKInstance>();

  // Untracked: the SDK knows the frame by the id it was opened with, so the
  // mount element must keep it.
  protected readonly frameId = computed(() => untracked(this.config).frameId);

  private readonly sdk = inject(DocSpaceSdk);
  private readonly platformId = inject(PLATFORM_ID);

  private instance?: SDKInstance;

  ngAfterViewInit(): void {
    // The SDK finds the mount element by id, so the view must already be in the
    // document (not ngOnInit); on the server there is no document at all.
    if (!isPlatformBrowser(this.platformId)) return;

    this.instance = this.sdk.initFrame(this.config());
    this.setDocspaceInstance.emit(this.instance);
  }

  ngOnDestroy(): void {
    this.instance?.destroyFrame();
    this.instance = undefined;
  }
}
