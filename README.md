# Building and Exporting a React Component For Another Web Application

Recently, I worked on a project to rewrite a legacy software system. After we began active development, we realized that we would be able to solve some acute needs of the legacy system with some of the features that we were building. We weren't ready to release the whole application, but we wanted to release some of the new features we've built.

So, we worked through that problem: exporting a handful of components from our React application for use in a Vue web application. When I first started looking into it, I had no idea where to begin (other than assuming I'd need to wrangle with Webpack), but after a few conversations with colleagues, discovered [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

## Web Components to the Rescue

From the docs on MDN, Web Components are defined as:

> Web Components aims to solve such problems — it consists of three main technologies, which can be used together to create versatile custom elements with encapsulated functionality that can be reused wherever you like without fear of code collisions.

The React component can be registered as a Web Component, which can be imported and used from another application (or just a plain HTML page in fact). With this approach, components are encapsulated within a shadow DOM and can't interfere with the rest of the application.

This sounded like a perfect fit for our needs.

## Creating our Web Component

React includes tools for creating and registering a Web Component, and we can use them in conjunction with our build tools. In the following example, I'm going to use Webpack. The full code is available on [GitHub](TODO).

```typescript
import * as React from "react";
import * as ReactDom from "react-dom";
import { FetchData } from "./fetch-data";

class StandaloneComponent extends HTMLElement {
  mountPoint!: HTMLSpanElement;
  name!: string;

  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const name = this.getAttribute("name");
    if (name) {
      ReactDom.render(<FetchData name={name} />, mountPoint);
    } else {
      console.error("You must declare a name!");
    }
  }
}
export default StandaloneComponent;

window.customElements.get("standalone-component") ||
  window.customElements.define("standalone-component", StandaloneComponent);
```

There's a few things going on in here - some of which are just a byproduct of the React & Web Component API. We must declare the class & extend the `HTMLElement`, we need to create a `mountPoint` & specify that we're attaching to the shadow DOM, and we need to define our Web Component (we don't need to redefine it if we already have). For our custom component, we require a name prop, and we can access it via the HTML "attributes" for prop-like parity.

I'll include some of the relevant Webpack configuration below, but feel free to refer to the GitHub repo for more details. This may not be relevant to your own build configuration, whether it's Webpack, ESBuild, or something else, but I've tried to highlight a few of the differences between our client Webpack configuration.

```javascript
module.exports = {
  // much of this is shared with webpack/client.config.js, but for simplicity, we are removing any chunking / minimizing / code splitting / other optimization and we have no need for HtmlWebpackPlugin or the devServer.
  entry: {
    app: ["./src/standalone.tsx"],
  },
  output: {
    path: path.resolve(__dirname, "../dist/standalone"),
    publicPath: `${JSON.stringify(config.get("server.publicHost"))}/standalone`, // looks like http://localhost:3000/standalone when running locally
    filename: "client.js",
  },
};
```

To use, it's important that the deployment & distribution process is easy. Therefore, we want to be able to serve the JavaScript bundle on a web server, rather than building into another web application.

We can do that pretty easily with Express, like:

```typescript
const port = process.env.PORT || 3001;

let app = express();

// other API endpoints

// serve the dist directory, where our standalone component is built
app.use(express.static("./dist/"));

app.listen(port, () => {
  console.info("up and running on port", port);
});
```

And we can use our script like:

```html
<html>
  <head>
    <script src="http://localhost:3001/standalone/client.js"></script>
  </head>

  <body>
    <standalone-component name="Web Component" />
  </body>
</html>
```

By including a script tag, it will fetch the JavaScript and register the Web Component, which allows us to run our component later in the page. Of course, we can follow a similar pattern in other languages and JavaScript frameworks, but I find that it's easiest to boil this down to the most simple case and stick with HTML when testing this out.

Part 1. Why Web Components
Part 2. Registering a Web Component in React, initial webpack configuration
Part 3. Importing a Web Component in Vue, importance of easy updates (src tag)
Part 4. Running a Web Worker from another domain
Part ?? Styled Components
