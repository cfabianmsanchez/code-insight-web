import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "analysis",
    pathMatch: "full",
  },
  {
    path: "analysis",
    loadComponent: () =>
      import("./features/code-analysis/pages/code-analysis-page/code-analysis-page.component").then(
        (m) => m.CodeAnalysisPageComponent,
      ),
  },
  {
    path: "**",
    redirectTo: "analysis",
  },
];
