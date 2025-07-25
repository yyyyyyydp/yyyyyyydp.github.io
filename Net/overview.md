# 笔记

## 包

### Microsoft.AspNetCore.Http 用于访问HTTP上下文

#### HttpContext


### Microsoft.AspNetCore.Mvc 提供MVC相关功能

#### ControllerBase

#### ApiController

启用API特定行为，如自动模型验证和问题详情响应

### Newtonsoft.Json JSON序列化

### Newtonsoft.Json.Serialization JSON反序列化

### Microsoft.AspNetCore.Authorization 授权

#### Authorize 

身份控制器及其派生控制器的访问，仅允许已认证用户。

通过 `[Authorize]` 属性实现授权。

## 类属性

### [Route]

#### [Route("api/[controller]")]

定义API端点的基本路由，`[controller]`会被替换为派生控制器的名称，例如`UserController`对应`api/Users`

## 教程

### 属性

属性是封装类字段的一种方式，方便控制“读”和“写”的权限，同时可以添加额外逻辑。

属性 = 字段 + 方法(get/set) 的封装方式。它看起来像字段，但本质上是调用了方法。

```c#
public class Person
{
    private string _name;

    public string Name
    {
        get { return _name; }   // 获取值（读）
        set { _name = value; }  // 设置值（写）
    }
}

var p = new Person();
p.Name = "张三";      // 实际上调用的是 set
Console.WriteLine(p.Name); // 实际上调用的是 get
```
感觉起了拦截器的作用，可以在`set`或者`get`时做一些事情。

## 片段

### SerializeSetting

```c#
public JsonSerializerSettings SerializeSetting
{
    get
    {
        Newtonsoft.Json.JsonSerializerSettings settings = new Newtonsoft.Json.JsonSerializerSettings();

        settings.ContractResolver = new DefaultContractResolver();
        return settings;
    }
}
```
- `DefaultContractResolver`表示序列化时属性名称将保持原样(Pascal命名，如`UserName`)
- `CamelCasePropertyNamesContractResolver`则序列化输出会变成小驼峰(如`userName`)

使用方法：
```c#
[HttpGet("custom-jsonresult")]
public JsonResult GetJsonResult()
{
    var data = new { UserName = "张三", Age = 28 };
    return new JsonResult(data, SerializeSetting);
}

/*
{
  "UserName": "张三",
  "Age": 28
}
*/
```

### CurrentUser

```c#
protected MemberLoginDto CurrentUser
{
    get
    {
        var result = new MemberLoginDto();
        var claimUser = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "UserInfo");
        if (claimUser != null)
        {
            result = Newtonsoft.Json.JsonConvert.DeserializeObject<MemberLoginDto>(claimUser.Value);
        }
        return result;
    }
}
```
- 从 `HttpContext.User.Claims` 中获取当前请求的用户声明（Claims）集合。
- 查找类型为 "UserInfo" 的声明，预期其包含 JSON 序列化的 MemberLoginDto 对象。
- 使用 Json.NET 把 Claim 中的字符串（JSON 格式）还原成一个 MemberLoginDto 对象。
- 如果未找到 "UserInfo" 声明，返回默认的 MemberLoginDto。
- 用于在认证端点中访问用户详细信息（如 ID、用户名）。