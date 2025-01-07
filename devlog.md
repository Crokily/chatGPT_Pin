## 开发日志：ChatGPT 对话收藏插件

### 问题 0：chrome.storage.local.get是异步
chrome.storage.local.get(['pinnedChats'], function(result) {
        console.log('Value currently is ');
        console.log(result.pinnedChats);
        pinnedChats = result.pinnedChats || [];
        console.log('pinnedChats');
        console.log(pinnedChats);
      });
      pinnedChats.forEach((chat) => {
        console.log('chat');
        console.log(chat);
        const pinItem = createPinItem(chat);
        pinList.appendChild(pinItem);
      });
这么写，foreach不会执行，因为异步未完成，pinnedChats还没拿到
将foreach放进function(result) {}内即可解决

### 问题 1：轮询注入 React 页面导致元素失效

**问题描述:**

在开发 ChatGPT 对话收藏插件时，最初采用轮询 (`setInterval`) 方式将按钮和列表注入到页面中。然而，由于 ChatGPT 是一个 React 应用，其页面路由切换和组件重新渲染会清理 DOM，导致注入的元素失效。

**涉及知识点:**

*   **React 渲染机制:** React 使用虚拟 DOM (Virtual DOM) 来管理 UI，并通过异步方式进行渲染和更新。
*   **客户端路由:** React 应用通常使用客户端路由，页面内容的变化不一定会触发完整的页面加载事件。
*   **DOM 操作:** 直接操作 DOM 可能会与 React 的渲染机制冲突，导致元素失效或出现不可预期的行为。

**解决方案:**

使用 `MutationObserver` API 替代轮询。`MutationObserver` 可以监视 DOM 树的变化，并在变化发生时执行回调函数。通过 `MutationObserver`，可以在 React 重新渲染页面后，重新注入插件元素，确保插件的稳定性和可靠性。

**代码摘要:**

```javascript
// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      // 检查目标容器是否存在
      if (document.querySelector(buttonContainerSelector)) {
        injectPinButton();
      }
      if (document.querySelector(listContainerSelector)) {
        injectPinList();
      }
    }
  }
});

// 配置观察选项
const config = { childList: true, subtree: true };

// 目标节点的父节点
const targetNode = document.body;

// 开始观察
observer.observe(targetNode, config);
```

### 问题 2：`MutationObserver` 触发频率过高导致元素重复注入

**问题描述:**

使用 `MutationObserver` 后，发现由于 React 的异步渲染机制和 `MutationObserver` 的高触发频率，`MutationObserver` 的回调函数在短时间内被执行了多次，导致插件的按钮和列表被重复添加到页面中。

**涉及知识点:**

*   **`MutationObserver` 触发机制:** `MutationObserver` 的回调函数会在每次 DOM 变化时被触发，而不是在所有变化完成后才触发。
*   **异步渲染:** React 的渲染过程是异步的，这意味着在短时间内 DOM 可能会发生多次变化。
*   **竞态条件 (Race Condition):** 多个 `MutationObserver` 回调函数可能会同时执行，导致逻辑错误。

**解决方案:**

采用 **去抖动 (Debouncing)** 技术来限制 `MutationObserver` 回调函数的执行频率。去抖动函数可以确保在事件被触发后，延迟一段时间执行回调函数。如果在这段时间内事件再次被触发，则重新计时。通过去抖动，可以确保在 React 渲染完成后只执行一次注入操作，避免重复添加元素。

**代码摘要:**

```javascript
// 去抖动函数
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 使用去抖动包装注入函数
const debouncedInjectPinButton = debounce(injectPinButton, 100);
const debouncedInjectPinList = debounce(injectPinList, 100);

// 在 MutationObserver 回调中使用去抖动后的函数
const observer = new MutationObserver((mutationsList, observer) => {
  // ...
  if (document.querySelector(buttonContainerSelector)) {
    debouncedInjectPinButton();
  }
  if (document.querySelector(listContainerSelector)) {
    debouncedInjectPinList();
  }
  // ...
});
```

