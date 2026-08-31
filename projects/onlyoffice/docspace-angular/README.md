# @onlyoffice/docspace-angular

This repo contains the ONLYOFFICE DocSpace Angular component which integrates [ONLYOFFICE DocSpace](https://github.com/ONLYOFFICE/DocSpace) into [Angular](https://angular.dev/) projects.

**Please note**: To work with this component, you need to have ONLYOFFICE DocSpace. If you are new to DocSpace, [create an account](https://www.onlyoffice.com/docspace-registration.aspx).

## Versions

| Angular          | docspace-angular |
|------------------|:----------------:|
| >=20.0.0         |       v1.x       |

## Prerequisites

This procedure requires [Node.js (and npm)](https://nodejs.org/en).

The component is built for Angular 20 and requires *@angular/common*, *@angular/core* and *@onlyoffice/docspace-sdk-js* 2.x as peer dependencies.

## Creating the demo Angular application with ONLYOFFICE DocSpace

This procedure creates a [basic Angular application](https://angular.dev/installation) and installs ONLYOFFICE DocSpace in it.

1. Open a command line or command prompt and install the [Angular CLI](https://angular.dev/tools/cli) package:
    ```
    npm install -g @angular/cli
    ```

2. Create a new Angular project named *docspace-angular-demo*:
    ```
    ng new --defaults --skip-git docspace-angular-demo
    ```

3. Go to the newly created directory:
    ```
    cd docspace-angular-demo
    ```

4. Install ONLYOFFICE DocSpace Angular component from **npm** and save it to the *package.json* file with *--save*:
    ```
    npm install --save @onlyoffice/docspace-angular @onlyoffice/docspace-sdk-js
    ```

    *@onlyoffice/docspace-sdk-js* is a peer dependency of the component. npm 7 and later installs it automatically, other package managers may require the explicit installation shown above.

5. Open the *./src/app/app.ts* file in the *docspace-angular-demo* project and replace its contents with the following code:

    ```typescript
    import { Component } from '@angular/core';
    import { DocSpaceComponent } from '@onlyoffice/docspace-angular';
    import type { SDKInstance } from '@onlyoffice/docspace-sdk-js/dist/types/instance';
    import type { TFrameConfig } from '@onlyoffice/docspace-sdk-js/dist/types/types';

    @Component({
      selector: 'app-root',
      imports: [DocSpaceComponent],
      template: `
        <docspace [config]="config" (setDocspaceInstance)="onSetDocspaceInstance($event)"></docspace>
      `,
    })
    export class App {
      config: TFrameConfig = {
        src: 'http://example-onlyoffice.com',
        frameId: 'onlyoffice-docspace',
        mode: 'manager',
        width: '100%',
        height: '100%',
        events: {
          onAppReady: () => console.log('ONLYOFFICE DocSpace App is ready!'),
          onAppError: (e) => console.log(e),
        },
      };

      onSetDocspaceInstance(instance: SDKInstance) {
        console.log(instance);
      }
    }
    ```
    Replace the following lines with your own data:
    * **"http://example-onlyoffice.com"** - replace with the address of your ONLYOFFICE DocSpace, specified without a trailing slash;

    This file will create the *App* component containing the ONLYOFFICE DocSpace configured with basic features.

    The component is standalone, so it is added to the `imports` of the component that uses it. In an NgModule-based application, add `DocSpaceComponent` to the `imports` of the module instead.

6. Test the application using the Node.js development server:
    * To start the development server, navigate to the *docspace-angular-demo* directory and run:
    ```
    npm start
    ```
    * To stop the development server, select on the command line or command prompt and press *Ctrl+C*.

## Deploying the demo Angular application

The easiest way to deploy the application to a production environment is to install [serve](https://github.com/vercel/serve) and create a static server:
1. Install the *serve* package globally:
    ```
    npm install -g serve
    ```

2. Serve your static site on the 3000 port:
    ```
    serve -s dist/docspace-angular-demo/browser
    ```
    Another port can be adjusted using the *-l* or *--listen* flags:
    ```
    serve -s dist/docspace-angular-demo/browser -l 4000
    ```

Now you can deploy the application to the created server:
1. Navigate to the *docspace-angular-demo* directory and run:
    ```
    npm run build
    ```
    The *dist* directory will be created with a production build of your app.

2. Copy the contents of the *dist/docspace-angular-demo/browser* directory to the root directory of the web server.

    The application will be deployed on the web server (*http://localhost:3000* by default).

## API

The component is exported as `DocSpaceComponent` and matches the `docspace` selector.

### Inputs
| Name | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| `config` | `TFrameConfig` | — | yes | Generic configuration object for opening a file with token. Requires `src` - the address of ONLYOFFICE DocSpace, specified without a trailing slash - and `frameId` - the id of the element the frame is mounted into. [Config API](https://api.onlyoffice.com/docspace/jssdk/config/) |

### Outputs
| Name | Type | Description |
| ------------- | ------------- | ------------- |
| `setDocspaceInstance` | `SDKInstance` | Emitted once, with the DocSpace instance, as soon as the frame is opened. The instance provides API methods for working with DocSpace. |

### Notes

* The `config` input is applied when the component is initialized. To change the configuration of the already opened DocSpace, use the `setConfig` method of the instance obtained via `setDocspaceInstance`, so that the frame is not recreated.
* The component renders a wrapper element around the DocSpace frame. Its width and height are taken from `config.width` and `config.height` (*100%* by default), which keeps the percentage sizes of the frame working.
* The frame is opened only in the browser. Under server-side rendering the component renders the wrapper and does nothing else, and opens the frame once the application is hydrated on the client.
* The SDK keys the frames it opens by `frameId`, so two components alive at the same time must not share one.

### Providing your own SDK

The component reaches the SDK through the `DocSpaceSdk` injectable, which is what makes the SDK replaceable. Provide your own to intercept frame creation - in tests, for example:

```typescript
TestBed.configureTestingModule({
  providers: [{ provide: DocSpaceSdk, useValue: fakeSdk }],
});
```

## Feedback and support

In case you have any issues, questions, or suggestions for the ONLYOFFICE DocSpace Angular component, please refer to the [Issues](https://github.com/ONLYOFFICE/docspace-angular-workspace/issues) section.

Official project website: [www.onlyoffice.com](https://www.onlyoffice.com/).

Support forum: [forum.onlyoffice.com](https://forum.onlyoffice.com/).

## License

The source code is licensed under the [Apache-2.0](https://github.com/ONLYOFFICE/docspace-angular-workspace/blob/master/LICENSE) license.
