import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import {CustomElemCommand}  from './customelem_command';
import defaultIcon 			from '../theme/icons/default.svg';


export default class CustomElemUI extends Plugin {


	init() {
		const editor 		= this.editor;
		const items      	= editor.config.get(( 'CustomElement.items' ))

		
		for (let i=0; i<items.length; i++){
			const tag  		= items[i].tag;
			const text 		= items[i].placeholder;
			const attr 		= items[i].attributes;
			const iconfile 	= items[i].icon;
			const icon     	= defaultIcon;

			if(typeof iconfile !== 'undefined'){
				if( iconfile.trim() !== ''){
					icon = require(iconfile)
				}
			}


			///schema 	
			editor.model.schema.register(tag, {
				inheritAllFrom: '$block'
			});

			//---conversion
			editor.conversion.elementToElement({ model: tag, view: tag });

			//---command
			const com =  'custom-element-'+tag;
			editor.commands.add( com, new CustomElemCommand( editor, tag, text, attr  ) );

			//---toolbar
			let view = this._createToolbarButton(com, icon);
			view.bind( 'isOn', 'isEnabled' ).to( com, 'value', 'isEnabled' );
			this.listenTo( view, 'execute', () => editor.execute( com ) );
		}		
		
	}

	
	_createToolbarButton(name, tbicon) {
		const editor = this.editor;

		return editor.ui.componentFactory.add( name, locale => {
			const button = new ButtonView( locale );

			button.isEnabled = true;
			button.isOn      = true;
			button.label     = name;
			button.tooltip   = true;
			button.icon		 = tbicon;

			return button;
		} );
	}

}

