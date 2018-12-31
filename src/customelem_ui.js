import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver 		from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
// import ContextualBalloon 	from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
// import clickOutsideHandler 	from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
// import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
 import {CustomElemCommand}    from './customelem_commands';

// import MathPreviewConfig 	from './mathpreview_config';
// import MathPreviewPopupView from './ui/mathpreview_popupview';
// import * as Utils 	        from './mathpreview_utils';
// import mathpreviewIcon 		from '../theme/icons/mathpreview.svg';



export default class CustomElemUI extends Plugin {


	init() {
		const editor 		= this.editor;
		const items      	= editor.config.get(( 'CustomElement.items ' ))
		const tags 			= items.map(i=>{return i.tag});
		const placeholders  = items.map(i=>{return i.placeholder});
		const attributes    = items.map(i=>{return i.attributes});
		
		for (let i=0; i<tags.length; i++){
			//---schema
			editor.model.schema.register(tags[i], {
				inheritAllFrom: '$block'
			});

			//---onversion
			editor.conversion.elementToElement({ model: tags[i], view: tags[i] });

			//---command
			const icom =  'custom-element-'+item;
			editor.commands.add( icom, new CustomElemCommand( editor, tags[index], placeholders[index], attributes  ) );

			//---toolbar
			this._createToolbarButton(icom);

		}		
		
	}

	
	_createToolbarButton(name) {
		const editor = this.editor;

		editor.ui.componentFactory.add( name, locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.isOn      = true;
			button.label     = name;
			button.tooltip   = true;

			return button;
		} );
	}

}

