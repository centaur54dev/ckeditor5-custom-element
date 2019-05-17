import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
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

			//schema
			if (inline){
				editor.model.schema.register(tag, {
					allowWhere: '$text',
					allowAttributes: attrkeys,
					isObject: true,
					isBlock:  true,
				}); 	
			}
			else{
				editor.model.schema.register(tag, {
					allowIn: '$root',
					allowAttributes: attrkeys,
					isObject: true,
					isBlock:  true,
				}); 	
			}
			
			
			editor.model.schema.extend( '$text', {
				allowIn: tag
			} );


			//---conversion
			editor.conversion.for( 'editingDowncast' ).elementToElement(
				editable?
					( {
						model: tag,
						view: ( modelItem, viewWriter ) => {
								const widgetElement = viewWriter.createContainerElement( tag );
								return toWidgetEditable( widgetElement, viewWriter );
							}
					} )
				:
					( {
						model: tag,
						view: ( modelItem, viewWriter ) => {
								const widgetElement = viewWriter.createContainerElement( tag );
								return toWidget( widgetElement, viewWriter );
							}
					} )
			);
			editor.conversion.for( 'dataDowncast' ).elementToElement(
				( {
					model: tag,
					view: tag
				} )
			);	
			editor.conversion.for( 'upcast' ).elementToElement(
				( {
					view: tag,
					model: tag
				} )
			);
			//attribute conversion
			for (let a=0; a<attrkeys.length; a++){
				editor.conversion.for( 'downcast' ).attributeToAttribute( ( {
					model: attrkeys[a],
					view: attrkeys[a],
					converterPriority: 'low'
				} ) );
				editor.conversion.for( 'upcast' ). attributeToAttribute( {
					view: attrkeys[a],
					model: attrkeys[a],
					converterPriority: 'low'
				} );
			}
			

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

