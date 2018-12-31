import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import {CustomElemCommand}  from './customelem_command';


export default class CustomElemUI extends Plugin {


	init() {
		const editor 		= this.editor;
		const items      	= editor.config.get(( 'CustomElement.items' ))
		// const tags 			= items.map(i=>{return i.tag});
		// const placeholders  = items.map(i=>{return i.placeholder});
		// const attributes    = items.map(i=>{return i.attributes});
		
		for (let i=0; i<items.length; i++){
			const tag  = items[i].tag;
			const text = items[i].placeholder;
			const attr = items[i].attributes;
			//---schema
			editor.model.schema.register(tag, {
				inheritAllFrom: '$block'
			});

			//---onversion
			editor.conversion.elementToElement({ model: tag, view: tag });

			//---command
			const icom =  'custom-element-'+tag;
			editor.commands.add( icom, new CustomElemCommand( editor, tag, text, attr  ) );

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

