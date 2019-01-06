<h1 align='center'>ParasiteJS</h1>
<p align='center'>
Use javascript the way you want, fast as possible.
</p>
<p align='center'>
<img src="https://img.shields.io/npm/v/parasitejs.svg" alt="module version">&nbsp;
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license">&nbsp;
    <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="contributions welcome">
</p>

## Objective
Now, more than ever, you do not need jQuery to manipulate HTML elements and their events. The ParasiteJS library consumes HTML elements, nodelists, and collections by adding key query and iteration functions, focusing on performance and agility in development.

### Performance
All added functions aim to approach vanilla performance.

### Agility in Development
When talking about agility, vanilla is more inefficient than all query libraries (for this, they exist :P).

The javascript does not have functions to manipulate the lists returned by the search of elements (querySelectorAll, getElements ...) forcing you to create functions to do this.

The ParasiteJS functions are available in collections and elements making these functions always available into the elements. The functions are based on jQuery but are NOT compatible, so check out the documentation below.

### Warning
This project does not objective the module creation. This is a lightweight and faster alternative than jQuery for "Do not use jQuery" projects where jQuery is not a dependency.

## Install

```shell
    npm i parasitejs
```

## How to use
### Module
Require ``parasitejs`` and he goes modify lists, collections and elements:
```typescript
    require('parasitejs')

    p$(() => {

        // Same as document.find
        let $el = p$('tag.class#id[attr="value"]')

        $el = $el.find('selector')

        $el .findTag('tag')     // Return collection
            .findId('id')       // Return element
            .findClass('class') // Return collection 
            .find('selector')   // Return list
            .css({ style: 'value' });

    })
``` 

### Web
Download script into **/dist/web/** folder and import normally:
```html
    <script type="text/javascript" src="parasite.min.js"/>

    <script>
        p$(() => { 

            // Same as document.find
            let $el = p$('tag.class#id[attr="value"]')

            $el = $el.find('selector')

            $el .findTag('tag')     // Return collection
                .findId('id')       // Return element
                .findClass('class') // Return collection 
                .find('selector')   // Return list
                .css({ style: 'value' });

        });
    </script>
``` 

## Pseudo jQuery-like Function
The ParasiteJS create a variable called ``p$``. That provides static functions and an constructor.

### jQuery-like Function
```typescript
    // Find selector and return collection
    p$(selector: string): ParasitedList | NodeList | HTMLCollection

    // on ready callback
    p$(handler: Function): void

    // Array of HTMLElements
    p$(elemArr: HTMLElement[]): mQuery

    // HTML Element
    m$(elem: HTMLElement): mQuery
```

#### Static Helpers
```typescript
    // DOM Ready
    p$.ready(fn: Function): void

    // Each lists and collections with length
    p$.each(list: ArrayLike<any>, iterator: (keyIndex: string|number, value: any) => boolean): ArrayLike<any>
```

#### Javascript Helpers
```typescript
    // Load other js files with javascript
    p$.require(filePath: string): void

    // Load javascript code
    p$.globalEval(code: string): void
```

#### AJAX
```typescript
    // Ajax jQuery-like
    p$.ajax(url?: string, settings: AJAXSettings): Deferred

    // GET URL
    p$.get(url: string, data?: any, success: AJAXSuccess): Deferred
    p$.get(settings: AJAXSettings): Deferred

    // POST URL
    p$.post(url: string, data: any, success: AJAXSuccess): Deferred
    p$.post(settings: AJAXSettings): Deferred
```

#### Promise
```typescript
    // Deferred jQuery-like
    p$.Deferred(beforeStart?: Function): Deferred
```

## Functions

### All
```typescript
    let obj: Document | HTMLElement | Window | NodeList | HTMLCollection

    // Attach an event handler function for one or more events.
    obj.on(events: string, selector?: string, handler: Function): this

    // Attach a handler to an event for the elements.
    // The handler is executed at most once per element
    // per event type.
    obj.one(events: string, selector?: string, handler: Function): this

    // Remove an event handler.
    obj.off(events: string, selector?: string, handler: Function): this

    // Execute all handlers and behaviors attached.
    obj.trigger(events: string, data?: any): this
```

### Document, HTMLElement, NodeList, HTMLCollection
```typescript
    let obj: Document | HTMLElement | NodeList | HTMLCollection

    // Execute getElementById (and filter if needed).
    obj.findId(id: string): Element | null

    // Execute getElementsByName.
    obj.findName(name: string): NodeList

    // Execute getElementsByTag.
    obj.findTag(tag: string): HTMLCollection

    // Execute getElementsByClass.
    obj.findClass(clss: string): HTMLCollection

    // Execute querySelector.
    obj.findOne(selector: string): Element | null

    // Forced querySelectorAll.
    obj.findAll(selector: string): NodeList

    // Optimized querySelectorAll (just execute
    // querySelectorAll if needed).
    obj.find(selector: string): NodeList | HTMLCollection | ParasitedList
```

### NodeList, HTMLCollection
```typescript
    let list: NodeList | HTMLCollection

    // Reduce the set of matched elements by selector
    // or test function.
    list.filter(selector: string | Function): ParasitedList

    // Retrieve one of the elements matched.
    list.get(index?: number): HTMLElement | void

    // Iterate over the list, executing a function
    // for each matched element.
    list.each(handler: EachIterator): this
```

### HTMLElement
```typescript
    let elem: HTMLElement

    // Set one or more attributes for the set
    // of matched elements or get first element attribute.
    elem.attr(attrs: PlainObject | string, value?: string): this | string

    // Remove an attribute from each element
    // in the set of matched elements.
    elem.removeAttr(attrNames: string): this

    // Set one or more properties for the set of
    // matched elements or get first element prop.
    elem.prop(props: PlainObject | string, value?: string): this | string

    // Remove a property for the set of matched elements.
    elem.removeProp(propNames: string): this

    // Set the value of each element in the set of
    // matched elements or get first element value.
    elem.val(value?: string): this | string

    // Store arbitrary data associated with the matched
    // elements or get first element data.
    elem.data(data: PlainObject | string, value?: string): this | string

    // Get the computed style properties for the first
    // element in the set of matched elements.
    elem.css(styles: PlainObject | string, value?: string): this | string

    // Check the current matched set of elements for
    // selector or test function.
    elem.is(filter: string | Function): boolean
```

## Author

- Created and maintained by [Emerson C. Romaneli](https://github.com/ECRomaneli) (@ECRomaneli).

## License

- ParasiteJS:
[MIT License](LICENSE)
