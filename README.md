# ckeditor5-custom-element
#Warning 
Under development

## About
This is a plugin for [ckeditor 5](https://github.com/ckeditor/ckeditor5). It allows to add custom elements in the editor. The html conversion of the created elements is like this:
```
	<CustomTag>placeholder text</CustomTag>
```

## Install
Install using NPM: 

`npm install ckeditor5-custom-element`

To add the functionality of this plugin you should make a custom build of the editor. Follow the instructions [here](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/development/installing-plugins.html).

To load the plugin, configure ckeditor `build-config.js` like this:
```
    module.exports = {
	// The editor creator to use, assuming ClassicEditor.
	editor: '@ckeditor/ckeditor5-editor-classic/src/classiceditor',

	// The name under which the editor will be exported.
	moduleName: 'ClassicEditor',


	plugins: [
                ...
                'ckeditor5-math-preview/src/customelement',
                ...
	         ],

	config: {
		toolbar: {
			items: [
                    ...
                    'custom-element-tagname1',
					'custom-element-tagname2',
                    ...
			       ]
		},

		CustomElement:{
			items:[
				{tag: 'tagname1', placeholder: 'some text', attributes:{}},
				{tag: 'tagname2', placeholder: 'some text', attributes:{}},
				...
			]
		},

        ...OTHER OPTIONS
	}
};
```

## Use
For the time being only addition of custom elements is properly impemented. If you want to change from one custom element to another, delete first. 