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

import { Injectable } from '@angular/core';

import SDK from '@onlyoffice/docspace-sdk-js';
import type { SDKInstance } from '@onlyoffice/docspace-sdk-js/dist/types/instance';
import type { TFrameConfig } from '@onlyoffice/docspace-sdk-js/dist/types/types';

/**
 * The seam between the component and `@onlyoffice/docspace-sdk-js`.
 *
 * The SDK is a plain class the component would otherwise have to construct
 * itself, which leaves no way to stand in for it. Going through an injectable
 * lets an application swap the SDK out — in unit tests, or on a platform where
 * the real one cannot run.
 */
@Injectable({ providedIn: 'root' })
export class DocSpaceSdk {
  /**
   * Opens an ONLYOFFICE Apps frame in the element `config.frameId` points at.
   *
   * Every call gets an SDK object of its own, so that nothing is shared between
   * frames: the SDK keys the frames it tracks by `frameId`, and reinitialises an
   * existing entry instead of opening a second frame under the same id.
   */
  initFrame(config: TFrameConfig): SDKInstance {
    return new SDK().initFrame(config);
  }
}
