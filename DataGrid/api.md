# API

## Props

### dataSource 数据源

将数据绑定到DataGrid组件

### allowColumnReordering 重新排序

指定用户是否可以对列重新排序，即用户拖动某列的列头，可以拖拽排序。

- default: false
- type: Boolean

### allowColumnResizing 允许列调整大小

指定用户是否可以调整列的大小。默认情况，每列的宽度取决于UI组件的宽度和列总数。

- default: false
- type: Boolean

### cacheEnabled 缓存

指定是否应缓存数据。如果开启，加载一次的数据将保存在缓存中。然后，UI组件在执行排序、分组、分页等操作时从该缓存中获取数据。

如果频繁更改的数据源，要禁用。当数据源需要大量时间才能加载的时候，这个属性很管用

如果要更新缓存中的数据，调用UI组件的[refresh()](#refresh())方法或者DataSource的[reload()](#reload())方法

- default: true
- type: Boolean

### remoteOperations 远程操作（待定）

当服务器未实现某些操作（`remoteOperations`为`false`时），它们将在客户端上执行。UI组件可能会在执行客户端操作时向服务器发送查询。

### rowAlternationEnabled 行交替着色 即斑马纹

指定是否应该以不同的方式对行进行着色

- default：false
- type：boolean

### showBorders 显示边框

指定UI组件的外部边框是否可见

- default：false
- type：Boolean

### width 宽度

指定UI组件的宽度

- default：undefined
- type：Number | String | undefined

### onOptionChanged {#onOptionChanged}

更改UI组件属性后执行的函数

### keyExpr 主键

指定提供键值以访问数据项的键属性。每个键值必须是唯一的，仅当`data`是简单数组时，此属性才适用。

- default：undefined
- type：String | String[] | undefined

## Methods

### reload() {#reload()}

清除当前加载的DataSource项并调用load()方法

DataSource从当前页面索引重新加载数据。要重新加载所有数据，在调用`reload()`方法之前将`pageIndex`设置为0

从此方法返回的`Promise`使用`operationId`字段进行扩展，可以使用改字段来取消调用的操作。`cancel(operationId)`

### refresh() {#refresh()}

重新加载数据并重新绘制数据行

`refresh()`调用`dataSource.reload()`并刷新组件属性。如果`repaintChangedOnly`为`false`（默认），则这个方法还会重新绘制所有数据行。

DataGrid无法跟踪在组件外部应用的数据源更改。若要在这种情况下更新组件，调用`refresh()`方法

```vue
<div ref="domRef"></div>

<script>
const domRef = ref('null')
domRef.value.instance.refresh()
</script>
```

- 在编辑模式下调用`refresh()`方法会丢弃为保存的更改并取消编辑模式。编辑时，mode为batch，则组件会取消编辑模式，但不会丢弃为保存的更改。
- `refresh()`在编辑时不会重新绘制编辑弹出窗口，mode为popup
- 如果DataGrid在Promise正在进行时访问其dataSource，则组件可能会reject刷新promise，为避免reject刷新promise，请修改在刷新完成后启动数据查询的属性。

## Columns

### format 格式（待定）

在值显示在列单元格中之前设置值的格式

- default：*

### cellTemplate

指定数据单元格的自定义模板

template中的数据
|名称|类型|描述|
|----|----|----|
|column 列|DataGrid Column|列的属性|
|columnIndex 列索引|Number|单元格列的索引|
|component 组件|DataGrid|UI组件的实例|
|data 数据|Object|单元格所属行的数据|
|displayValue|any|单元格的显示值。仅当列使用`lookup`或者`calculateDisplayValue`时，才与`value`字段不同|
|oldValue|any|单元格的旧值，仅当`repaintChangedOnly`为`true`时定义|
|row 行|DataGrid Row|单元格的行|
|rowIndex 行索引|Number|单元格行的索引，每页上从0开始。|
|rowType 行类型|String|行的类型|
|text 文本|String|displayValue的intent和customizeText之后|
|value 值|any|单元格的原始值|
|watch 监听|Function|允许跟踪变量并响应值更改。当`repaintChangesOnly`为`true`时应用|

### cssClass css类

指定要应用于列的CSS类

- default：undefined
- type：String | undefined

下面代码，这个属性分配了一个`cell-highlighted`CSS类，用于自定义`location`列的单元格和标题样式。

```vue
<template>
  <DxDataGrid ...
    :data-source="employees">
    <DxColumn data-field="ID" />
    <DxColumn data-field="position" css-class="cell-highlighted" />
  </DxDataGrid>
</template>

<style>
.dx-data-row .cell-highlighted {
    background-color: #e6e6e6;
}
 
.dx-header-row .cell-highlighted {
    color: gray;
    font-style: italic;
}
</style>
```

### caption 标题

指定列的标题，使用这个属性可以显示列的描述性名称。如果没有设置这个属性，则将根据`dataField`的名称生成标题

- default：undefined
- type：String | undefined

### groupIndex 组索引

指定按照网格记录按照改列的值分组时列的索引。

用户可以使用[context menu](#contextMenuEnabled)或者[group panel](#groupPanel)。但在某些情况下，最初必须对网格记录进行分组。将整数值分配给应用于对网格记录进行分组的列的`groupIndex`属性。

- default：undefined
- type：Number | undefined
- 引发的事件：[onOptionChanged](#onOptionChanged)

```vue
<template>
<DxDataGrid ... >
  <DxColumn
      data-field="FirstName"
      :group-index="1"
  />
  <DxColumn
      data-field="LastName"
      :group-index="0"
  />
</DxDataGrid>
</template>

<script>
const dataSource = [
  { FirstName: "John", LastName: "Doe", Title: "Sales Manager" },
  { FirstName: "Michael", LastName: "King", Title: "Sales Representative" },
  // ...
];
</script>
```

### dataField 数据字段

将列绑定到dataSource的字段

- default：undefined
- type：String | undefined

columns数组可以包含列对象和数据字段名称作为字符串。如果使用列对象，请指定dataField属性以将对象绑定到数据源中的列。

### dataType 数据类型

将列值强制转换为特定数据类型

- default：undefined
- type：string | number | date | boolean | object | datetime | undefined

如果数据字段提供一种数据类型的值，但是UI组件应该将其强制转换为另一种数据类型，请在次数行中指定正确的类型。

> [!TIP]注意
> boolean：DataGrid在单元格中呈现CheckBox组件
> number：改组件将值和标题与列的右侧对齐
> object：
>> - 该组件实现了toString()方法来显示字段。要集成自定义显示逻辑，实现`columns[].calculateCellValue`或者`calculateDisplayValue`
>> - DataGrid不会为filterRow生成filterOperations
>> - 组件的filterBuilder仅仅包括扩展的过滤器操作：`anyof` `noneof` `isblank` `isnotblank`

### alignment 对齐 {#alignment}

对齐列的内容

- default：undefined
- type：undefined | center | left | right

内容的默认对齐方式取决于数据类型

|数据类型|对齐|
|----|----|
|number|right|
|boolean|center|
|string|left|
|date|left|
|datetime|left|

### allowGrouping 允许分组

用户是否可以按此列的值对数据进行分组，仅在启用分组时适用

- default：true
- type：boolean

在UI组件中启用分组后，用户可以按照任何列的值对数据进行分组。要禁止将特定列用于分组，请将此列的allowGrouping属性设置为false

也就是如果将某列设置为false，那么该列就不会被拖动放到顶部分列部分。

### allowExporting 允许导出

指定是否应该导出此列中的数据，仅仅当列的[visible](#visible)为`true`时适用

- default：true
- type：boolean

如果导出具有多行标题的DataGrid，不要禁用allowExporting属性

### visible {#visible}

指定列是否可见，即是否占用表中的空间

- default：true
- type：boolean
- 引发的事件：[onOptionsChanged](#onOptionChanged)

## grouping

### contextMenuEnabled {#contextMenuEnabled}

## groupPanel {#groupPanel}

DataGrid中的数据可以按一列或者多列分组。将列用于分组后，它将添加到组面板中。

默认情况下，组面板处于隐藏状态。要使其可见，必须设置**groupPanel**，`visible`属性设置为`true`。或者，组面板的可见性可能取决于设备的屏幕尺寸。若要实现此行为，将`visible`属性设置为`auto`。

如果需要显示组面板，但使其无响应。轻微`groupPanel.allowColumnDragging`赋值`false`。当网格记录最初被分组时，当用户需要了解该分组但不能更改它时，这很有用。