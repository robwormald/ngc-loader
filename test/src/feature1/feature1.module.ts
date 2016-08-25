import {NgModule, Component} from '@angular/core'

@Component({
	selector: 'feature-one-component',
	template: 'feature one!'
})
export class FeatureOneComponent {}


@NgModule({
	exports: [FeatureOneComponent],
	declarations: [FeatureOneComponent]
})
export class FeatureOneModule {}
