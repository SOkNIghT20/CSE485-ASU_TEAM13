# Version update angular 16 overview

This README is simply a general overview of updating to angular 16. It is not a 1:1 at every step.
It does include some of what we ran in the terminal, some of the output, as well as files that were changed.
There should be updated made to Eslint in the future, but ASU_1_2025-Spring-2025 will continue with further angular updates.

## Project Team

ASU_1_2025-Spring-2025

(Team Lead) Gavin Fiedler: <gfiedler@asu.edu> | 602-663-2685
Rsheed Alrashidi: <ralrash3@asu.edu>
Luan Phan: <lphan6@asu.edu>

## Angular website walkthough

<https://angular.dev/update-guide?v=15.0-16.0&l=3>

ASU_1_2025 Version update 0.0.2
What we did:
updated angular from 15 -> 16

what we ran: ng update @angular/core@16 @angular/cli@16

Files affected:
angular.json
package-lock.json
package.json
src\app\guards\auth.guard.ts
src\app\guards\logged-in.guard.ts

Program does not compile/run at this point. Continuing with checklist.
checking more of the checklist to see if we have improper code:
rg -t ts -C 2 -e "router\.events\.subscribe" \
 -e "ComponentFactoryResolver" \
 -e "renderModuleFactory" \
 -e "XhrFactory" \
 -e "ApplicationConfig" \
 -e "withServerTransition" \
 -e "runInContext" \
 -e "ReflectiveInjector" \
 -e "entryComponents" \
 -e "ANALYZE_FOR_ENTRY_COMPONENTS" \
 -e "moduleId" \
 -e "BrowserTransferStateModule" \
 -e "PlatformConfig" \
 -e "addGlobalEventListener" \
 -e "TransferState.\*@angular/platform-browser" \
 -e "NavigationEnd" \
 -e "RouterEvent" \
 -e "ActivatedRoute" \
 -e "BrowserPlatformLocation" \
 -e "MockPlatformLocation"
speech-to-text/node_module/@types/node/vm.d.ts
114- class Script {
115- constructor(code: string, options?: ScriptOptions);
116: runInContext(contextifiedSandbox: Context, options?: RunningScriptOptions): any;
117- runInNewContext(sandbox?: Context, options?: RunningScriptOptions): any;
118- runInThisContext(options?: RunningScriptOptions): any
--

121- function createContext(sandbox?: Context, options?: CreateContextOptions): Context;
122- function isContext(sandbox: Context): boolean;
123: function runInContext(code: string, contextifiedSandbox: Context, options?: RunningScriptOptions | string): any;
124- function runInNewContext(code: string, sandbox?: Context, options?: RunningScriptOptions | string): any;
125- function runInThisContext(code: string, options?: RunningScriptOptions | string): any;

src/app/media-transfer/pages/redirect/redirect.component.ts
1-import { Component, OnInit, ViewChild } from '@angular/core';
2:import { ActivatedRoute, Router } from '@angular/router';
3-import { MediaTransferService } from '../../../services/media-transfer.service';
4-import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component'
--

11-export class TransferRedirectComponent {
12- @ViewChild(ProgressSpinnerComponent) spinner!: ProgressSpinnerComponent;
13: constructor(private router: Router, private route: ActivatedRoute, private mediaTransferService: MediaTransferService) { }
14- progress: number | null = null;
15-

src/app/app.component.ts
1-import { Component } from '@angular/core';
2:import { Router, NavigationEnd } from '@angular/router'; // Import NavigationEnd
3-import { HttpClient } from '@angular/common/http';
4-import { AuthService } from "./services/auth.service";

src/app/guards/logged-in.guard.ts
1-import { Injectable } from '@angular/core';
2:import { Event, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
3-import { Observable } from 'rxjs';
4-import { AuthService } from "../services/auth.service"
--

10-
11-
12: canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
13- if (!this.auth.isAuthenticated()) {
14- return true;

src/app/guards/auth.guard.ts
1-import { Injectable } from '@angular/core';
2:import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
3-import { Observable } from 'rxjs';
4-import { AuthService } from "../services/auth.service"
--

12- ) {}
13-
14: canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
15- const currentUser = this.auth.currentUserValue;
16- if (currentUser) {

manually fixing...

notice duplicate declarations in vm.d.ts, removed.
issue with @types/node incorrect version, updating: npm install --save-dev @types/node@^22
some libraries are not compatible with ivy, running: npm install ngx-bootstrap@^10 ng2-charts@^5 ng-multiselect-dropdown@^0.6.0 ---errors found, running different fix: ng update @angular/core@16 @angular/cli@16 @angular/cdk@16 @angular/material@16

ran, should be fully v16 now. Errors resolving library updates, asking for Charts.js v3+. Going to try and update that. : npm install chart.js@^4 ng2-charts@^5 ngx-bootstrap@^10 ng-multiselect-dropdown@^0.6.0
issue with that, ngx-bootstrap is not compatible with update. Upgrade to v11: npm install ngx-bootstrap@^11 --> Worked, going back to previous step to run it again: npm install ng-multiselect-dropdown@^0.5.6 chart.js@^4 ng2-charts@^5

rm -rf node_module and package-lock.json
npm install

npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated @npmcli/move-file@2.0.1: This functionality has been moved to @npmcli/fs
npm warn deprecated @babel/plugin-proposal-unicode-property-regex@7.18.6: This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-unicode-property-regex instead.
npm warn deprecated source-map-url@0.4.1: See <https://github.com/lydell/source-map-url#deprecated>
npm warn deprecated read-package-json@6.0.4: This package is no longer supported. Please use @npmcli/package-json instead.
npm warn deprecated lodash.get@4.4.2: This package is deprecated. Use the optional chaining (?.) operator instead.
npm warn deprecated npmlog@6.0.2: This package is no longer supported.
npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
npm warn deprecated har-validator@5.1.5: this library is no longer supported
npm warn deprecated urix@0.1.0: Please see <https://github.com/lydell/urix#deprecated>
npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
npm warn deprecated @babel/plugin-proposal-async-generator-functions@7.20.7: This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-async-generator-functions instead.
npm warn deprecated resolve-url@0.2.1: <https://github.com/lydell/resolve-url#deprecated>
npm warn deprecated are-we-there-yet@3.0.1: This package is no longer supported.
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@8.1.0: Glob versions prior to v9 are no longer supported
npm warn deprecated source-map-resolve@0.5.3: See <https://github.com/lydell/source-map-resolve#deprecated>
npm warn deprecated domexception@2.0.1: Use your platform's native DOMException instead
npm warn deprecated w3c-hr-time@1.0.2: Use your platform's native performance.now() and performance.timeOrigin.
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated querystring@0.2.0: The querystring API is considered Legacy. new code should use the URLSearchParams API instead.
npm warn deprecated gauge@4.0.4: This package is no longer supported.
npm warn deprecated uuid@3.4.0: Please upgrade to version 7 or higher. Older versions may use Math.random() in certain circumstances, which is known to be problematic. See <https://v8.dev/blog/math-random> for details.
npm warn deprecated request@2.88.2: request has been deprecated, see <https://github.com/request/request/issues/3142>
npm warn deprecated @wessberg/ts-evaluator@0.0.27: this package has been renamed to ts-evaluator. Please install ts-evaluator instead
npm warn deprecated angular@1.8.3: For the actively supported Angular, see <https://www.npmjs.com/package/@angular/core>. AngularJS support has officially ended. For extended AngularJS support options, see <https://goo.gle/angularjs-path-forward>.
npm warn deprecated popper.js@1.16.1: You can find the new Popper v2 at @popperjs/core, this package is dedicated to the legacy v1
npm warn deprecated tslint@6.1.3: TSLint has been deprecated in favor of ESLint. Please see <https://github.com/palantir/tslint/issues/4534> for more information.
npm warn deprecated core-js@2.6.12: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.

added 1643 packages, and audited 1853 packages in 4m

178 packages are looking for funding
run `npm fund` for details

21 vulnerabilities (4 low, 11 moderate, 4 high, 2 critical)

charts are out of date, removing and then update. rm rf again, intalled bootstrap v11.
calling ng serve

updating app.modules.ts and associated libraries
found out that angular 19 does NOT use tslint.json, having to migrat to eslint.json
download tslint-to-eslint if you don't already have it (<https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration>)
newest version causes issues, downgrade to v8
npm install --save-dev eslint@8.57.0
npm install --save-dev @angular-eslint/eslint-plugin @typescript-eslint/eslint-plugin-tslint

deleted tslint.json file
mv eslintrc.js to cjs due to error
ran npx eslint . --ext .ts,.html to finish setup. Error
after creating a .eslintignore and specifying in the eselintrc.cjs file, finally prints out. 1000+ errors after running --fix

running an update

tutor meeting: lots of type inject errors, resolved by removing Type from the imports.
//modules not found, installing modules
npm install modules

resolve type error for :
src/app/media-transfer/pages/mediatransfer/mediatransfer.component.ts
src/app/media-transfer/pages/error/error.component.ts
src/app/media-transfer/pages/success/success.component.ts
src/app/search/search.component.ts
src/app/mediaAnalytics/mediaAnalytics.component.ts
src/app/login/register/register.component.ts
src/app/login/profile/profile.component.ts
src/app/search/search.component.ts:
src/app/media-transfer/pages/redirect/redirect.component
src/app/login/passwordRecovery/passwordRecovery.component.ts
src/app/login/newAlerts/newAlerts.component.ts
src/app/login/login.component.ts
src/app/login/alerts/alerts.component.ts
src/app/helpPage/helpPage.component.ts
src/app/customize-logo/customizeLogo.component.ts
src/app/contactUs/contactUs.component.ts
src/app/components/demo-request-modal/demo-request-modal.component.ts
src/app/components/ad-debug/ad-debug.component.ts
src/app/app.component.ts
src/app/add-radio/addRadio.component.ts

    after resolving all type errors and switching to NgChartsModule to match usage, the program builds on server and SE.
    Website does not work, handling errors from there.

    issue was import type in logged-in.guard, auth.service, login.component, auth.guards all .ts files. Further, some injectable issues were pulling up, so added which cleared up issues:
    @Injectable({
    providedIn: 'root'
    })

    and this proved to help. Some pages are still not loading in correctly: search, email alerts, media transfer, lang. trans. contact us,
    but that shouldn't be a big issue.

    Final update for v16, eslint needs to be fully integrated but v16 is fully working now.

    Please refer to the README file that I will be including.
