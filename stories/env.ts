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

// Storybook reads .env at build time and substitutes the STORYBOOK_-prefixed
// variables into the bundle; nothing else from the environment reaches it, and
// none of this is part of the published library.
declare const process: { env: Record<string, string | undefined> };

/** The ONLYOFFICE Apps workspace every story points at. */
export const DOCSPACE_URL = process.env['STORYBOOK_DOCSPACE_URL'] ?? '';

/** The file the Editor story opens. */
export const DOCSPACE_FILE_ID = process.env['STORYBOOK_DOCSPACE_FILE_ID'] ?? '';
