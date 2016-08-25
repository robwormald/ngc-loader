import {NgModule, Component} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FeatureOneModule} from './feature1/feature1.module'


@Component({
	selector: 'app-component',
	template: 'hello world'
})
export class AppComponent {}

@NgModule({
	imports: [BrowserModule, FeatureOneModule],
	declarations: [AppComponent]
})
export class AppModule {}
