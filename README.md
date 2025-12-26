# Getting Started

This project is hosted in a public GitHub repository and you can clone it. If you have any issues contact @senzid. You can see a production version of this project in [qamarero-test.vercel.app](https://qamarero-test.vercel.app/).

## Install the project locally

First, you need to make a copy of the .env.example file and ask for the correct values to @senzid.

After that, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

This project is built on a "light version" of screaming architecture and applies basic concepts of hexagonal architecture to easily scale if it's necessary. It means that we have a features folder that contains all the logic (domain layer) and more folders that are structured to support our business logic. The folder structure is as follows:

### app
Contains only routes (pages) files, but they contain no logic, only composition. Only renders components from features or components folder. Inside the api directory you can find 2 endpoints, 1 to obtain the restaurant's JSON bill and another to make payments

### components
Contains our "dummy" components. This folder contains the components that I want to reuse, but they do not contain business logic. For example, components like Cards, Header, etc.

### context
Contains generic context functions to share data throughout the application. It's an adapter layer.

### data
JSON data for this test.

### features
This is the domain layer. **The most important part of our application** as it contains the business logic. Each specific feature has its own directory and it contains all the components or functions to manage itself. 

### lib
Contains generic types, generic functions or generic data fetching methods.