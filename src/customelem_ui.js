import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { downcastElementToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToElement } 	from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import { toWidget, toWidgetEditable } 				from '@ckeditor/ckeditor5-widget/src/utils';
import {CustomElemCommand}  from './customelem_command';
import defaultIcon 			from '../theme/icons/default.svg';


export default class CustomElemUI extends Plugin {


	init() {
		const editor 		= this.editor;
		const items      	= editor.config.get(( 'CustomElement.items' ))

		
		for (let i=0; i<items.length; i++){
			const tag  		= items[i].tag;
			const text 		= this._safeGet(items[i].placeholder, tag);
			const attr 		= this._safeGet(items[i].attributes, {});
			const inline	= this._safeGet(items[i].inline, false);
			const editable	= this._safeGet(items[i].editable, false);
			let   icon	 	= this._safeGet(items[i].icon, defaultIcon);

			const attrkeys = Object.keys(attr);

			if (inline){
				editor.model.schema.register(tag, {
					allowWhere: '$text',
					allowAttributesOf: attrkeys,
					isObject: true,
					isBlock:  true,
				}); 	
			}
			else{
				editor.model.schema.register(tag, {
					allowIn: '$root',
					allowAttributesOf: attrkeys,
					isObject: true,
					isBlock:  true,
				}); 	
			}
			


			// ///schema
			// if (editable){
			// 	editor.model.schema.register(tag, {
			// 		allowWhere: inline? '$text' : '$root',
			// 		allowContentOf: '$block',
			// 		allowAttributesOf: attrkeys,
			// 		isObject: false,
			// 		isBlock:  true,
			// 		isLimit:  true
			// 	}); 
			// }
			// else{
			// 	editor.model.schema.register(tag, {
			// 		allowWhere: inline? '$text' : '$root',
			// 		allowAttributesOf: attrkeys,
			// 		isObject: true,
			// 		isBlock: true
			// 	}); 
			// }
			
			editor.model.schema.extend( '$text', {
				allowIn: tag
			} );
			// editor.model.schema.register(tag, {
			// 	inheritAllFrom: '$block'
			// });



			//---conversion
			//editor.conversion.elementToElement({ model: tag, view: tag });
			editor.conversion.for( 'editingDowncast' ).add(
				editable?
					downcastElementToElement( {
						model: tag,
						view: ( modelItem, viewWriter ) => {
								const widgetElement = viewWriter.createContainerElement( tag );
								return toWidgetEditable( widgetElement, viewWriter );
							}
					} )
				:
					downcastElementToElement( {
						model: tag,
						view: ( modelItem, viewWriter ) => {
								const widgetElement = viewWriter.createContainerElement( tag );
								return toWidget( widgetElement, viewWriter );
							}
					} )
			);
			editor.conversion.for( 'dataDowncast' ).add(
				downcastElementToElement( {
					model: tag,
					view: tag
				} )
			);	
			editor.conversion.for( 'upcast' ).add(
				upcastElementToElement( {
					view: tag,
					model: tag
				} )
			);

			//---command
			const com =  'custom-element-'+tag;
			editor.commands.add( com, new CustomElemCommand( editor, tag, text, inline, attr  ) );

			//---toolbar
			this._createToolbarButton(com, icon);
			
		}		
		
	}

	
	_createToolbarButton(name, tbicon) {
		const editor = this.editor;

		editor.ui.componentFactory.add( name, locale => {
			const button = new ButtonView( locale );
			const command = editor.commands.get( name );


			button.isEnabled = true;
			button.isOn      = true;
			button.label     = name;
			button.tooltip   = true;
			button.icon		 = tbicon;

			button.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
			this.listenTo( button, 'execute', () => editor.execute( name ) );

			return button;
		} );
	}


	_safeGet(input, safeDefault){
		if( typeof input !== 'undefined' &&  (input || input===false || input===0) ){
			return input;
		}
		else{
			return safeDefault;
		}
	}
}

