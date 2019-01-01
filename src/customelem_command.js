import Command 				from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition} from '@ckeditor/ckeditor5-widget/src/utils';



export class CustomElemCommand extends Command {

    constructor( editor, tagName, placeholder, inline, attributes ) {
        super( editor );
        
        this.tagName     = tagName;
        this.placeholder = placeholder;
        this.attributes  = attributes;
        this.inline      = inline;
    };


	execute(  ) {
        const model = this.editor.model;

		model.change( writer => {
			
            const elem = writer.createElement( this.tagName, this.attributes );
            writer.appendText(this.placeholder, elem);
            // const insertAtSelection = this.inline? model.document.selection.getFirstPosition()
            //                                      : findOptimalInsertionPosition( model.document.selection, model );

            const insertAtSelection = model.document.selection.getFirstPosition();
            model.insertContent( elem, insertAtSelection );

            if ( elem.parent ) {
                writer.setSelection( elem, 'on' );
            }
        });
    };
}





