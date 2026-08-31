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

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import type { TFrameConfig } from '@onlyoffice/docspace-sdk-js/dist/types/types';
import { DocSpaceComponent } from '@onlyoffice/docspace-angular';

import { DOCSPACE_FILE_ID, DOCSPACE_URL } from './env';

const onAppReady = () => {
  console.log('ONLYOFFICE DocSpace App is ready!');
};

const onAppError = (e?: Event | object | string) => {
  alert(e);
};

const defaultConfig: TFrameConfig = {
  src: DOCSPACE_URL,
  frameId: 'onlyoffice-docspace',
  mode: 'manager',
  width: '100%',
  height: '100%',
  events: {
    onAppReady: onAppReady,
    onAppError: onAppError,
  },
};

let frameSeq = 0;

/**
 * The SDK keys every frame it opens by `frameId`, so two live frames must never
 * share one. Storybook remounts a story on hot reload and when it is navigated
 * back to, which can overlap the new frame with the one being torn down, so the
 * story id alone is not enough. Each mount takes the next suffix, and the field
 * holds on to it for the life of that mount so re-renders keep the same id.
 */
@Component({
  selector: 'docspace-story',
  imports: [DocSpaceComponent],
  template: `<docspace [config]="uniqueConfig()"></docspace>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DocSpaceStory {
  readonly config = input.required<TFrameConfig>();

  private readonly suffix = ++frameSeq;

  protected readonly uniqueConfig = computed<TFrameConfig>(() => ({
    ...this.config(),
    frameId: `${this.config().frameId}-${this.suffix}`,
  }));
}

const meta: Meta<DocSpaceComponent> = {
  title: 'Example/DocSpace',
  component: DocSpaceComponent,
  decorators: [moduleMetadata({ imports: [DocSpaceStory] })],
  render: (args) => ({
    props: args,
    template: `<docspace-story [config]="config"></docspace-story>`,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        // Docs stories render inline, next to the rest of the page, where nothing
        // gives the story a height of its own, so a frame asking for
        // `height: 100%` collapses. An iframe of its own gives the frame a
        // viewport it can fill.
        inline: false,
        iframeHeight: '600px',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<DocSpaceComponent>;

export const Manager: Story = {
  args: {
    config: {
      ...defaultConfig,
      frameId: 'onlyoffice-docspace-manager',
    },
  },
};

export const Editor: Story = {
  args: {
    config: {
      ...defaultConfig,
      frameId: 'onlyoffice-docspace-editor',
      mode: 'editor',
      id: DOCSPACE_FILE_ID,
    },
  },
};

export const RoomSelector: Story = {
  args: {
    config: {
      ...defaultConfig,
      frameId: 'onlyoffice-docspace-room-selector',
      mode: 'room-selector',
    },
  },
};

export const FileSelector: Story = {
  args: {
    config: {
      ...defaultConfig,
      frameId: 'onlyoffice-docspace-file-selector',
      mode: 'file-selector',
    },
  },
};

export const System: Story = {
  args: {
    config: {
      ...defaultConfig,
      frameId: 'onlyoffice-docspace-system',
      mode: 'system',
    },
  },
};
