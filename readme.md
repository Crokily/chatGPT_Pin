# ChatGPT Chat Pin - 简单的 ChatGPT 对话置顶插件 / Simple ChatGPT Chat Pinning Chrome Extension

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ilncoacgeflcogachikmceiebknknaem.svg?label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/ilncoacgeflcogachikmceiebknknaem)

**中文 | [English](#english)**

## 中文

这是一个简单、免费的 Chrome 插件，用于置顶 ChatGPT 对话，方便你随时回顾重要的聊天记录。

### 功能

*   **置顶/取消置顶对话:** 在每个 ChatGPT 对话窗口的右上角，你会看到一个 "Pin" / "Unpin" 按钮。点击按钮即可将当前对话添加到置顶列表或从列表中移除。
*   **置顶列表:** 在 ChatGPT 侧边栏的顶部，你会看到一个 "Pin" 列表，其中列出了所有已置顶的对话。点击列表中的对话标题即可快速跳转到该对话。
*   **数据存储:** 使用 `chrome.storage.local` API 将置顶的对话数据存储在本地，即使关闭浏览器也不会丢失数据。

### 安装

你可以通过以下两种方式安装此插件：

1. **Chrome Web Store:** [即将上线，敬请期待！]
2. **手动安装:**
    1. 下载或克隆此仓库到本地。
    2. 在 Chrome 浏览器中打开 `chrome://extensions/`。
    3. 打开右上角的 "开发者模式" 开关。
    4. 点击 "加载已解压的扩展程序" 按钮。
    5. 选择你下载或克隆的插件目录。

### 开发过程

这个插件的开发主要克服了以下两个挑战：

#### 1. 如何在 React 应用中正确注入元素

ChatGPT 是一个基于 React 构建的单页应用 (SPA)。React 的虚拟 DOM 和异步渲染机制使得传统的 DOM 操作方法 (例如 `setInterval` 轮询注入) 变得不可靠。注入的元素可能会在页面路由切换或组件重新渲染后消失。

**解决方案:** 使用 `MutationObserver` API。

`MutationObserver` 可以监视 DOM 树的变化，并在变化发生时执行回调函数。这使得我们能够在 React 重新渲染页面后，重新注入插件元素，确保插件的稳定性和可靠性。

**关键代码:**

```javascript
// 创建 MutationObserver 实例
const observer = new MutationObserver((mutationsList, observer) => {
  // ...
});

// 配置观察选项
const config = { childList: true, subtree: true };

// 目标节点的父节点
const targetNode = document.body;

// 开始观察
observer.observe(targetNode, config);
```

#### 2. 如何避免 `MutationObserver` 触发频率过高导致元素重复注入

由于 React 的异步渲染机制和 `MutationObserver` 的高触发频率，`MutationObserver` 的回调函数会在短时间内被执行多次，导致插件的按钮和列表被重复添加到页面中。

**解决方案:** 采用 **去抖动 (Debouncing)** 技术。

去抖动函数可以确保在事件被触发后，延迟一段时间执行回调函数。如果在这段时间内事件再次被触发，则重新计时。通过去抖动，可以确保在 React 渲染完成后只执行一次注入操作，避免重复添加元素。

**关键代码:**

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
```

### 贡献

欢迎提交 issue 或 pull request 来帮助改进这个插件！

### 许可证

[MIT License](LICENSE)

---

<br>

## <a id="english"></a>English

This is a simple and free Chrome extension for pinning ChatGPT conversations, making it easy to revisit important chats.

### Features

*   **Pin/Unpin Conversations:** You will see a "Pin" / "Unpin" button in the top right corner of each ChatGPT conversation window. Click the button to add the current conversation to the pinned list or remove it from the list.
*   **Pinned List:** At the top of the ChatGPT sidebar, you will see a "Pin" list, which lists all pinned conversations. Click the conversation title in the list to quickly jump to that conversation.
*   **Data Storage:** Uses the `chrome.storage.local` API to store pinned conversation data locally, so data is not lost even when the browser is closed.

### Installation

You can install this extension in two ways:

1. **Chrome Web Store:** [Coming soon, stay tuned!]
2. **Manual Installation:**
    1. Download or clone this repository locally.
    2. Open `chrome://extensions/` in your Chrome browser.
    3. Turn on the "Developer mode" switch in the upper right corner.
    4. Click the "Load unpacked" button.
    5. Select the directory of the plugin you downloaded or cloned.

### Development Process

The development of this plugin mainly overcame the following two challenges:

#### 1. How to Properly Inject Elements in a React Application

ChatGPT is a Single Page Application (SPA) built on React. React's virtual DOM and asynchronous rendering mechanism make traditional DOM manipulation methods (such as `setInterval` polling injection) unreliable. Injected elements may disappear after page routing or component re-rendering.

**Solution:** Use the `MutationObserver` API.

`MutationObserver` can monitor changes in the DOM tree and execute callback functions when changes occur. This allows us to re-inject plugin elements after React re-renders the page, ensuring the stability and reliability of the plugin.

**Key Code:**

```javascript
// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList, observer) => {
  // ...
});

// Configure observation options
const config = { childList: true, subtree: true };

// Parent node of the target node
const targetNode = document.body;

// Start observing
observer.observe(targetNode, config);
```

#### 2. How to Avoid Duplicate Element Injection Due to High Trigger Frequency of `MutationObserver`

Due to React's asynchronous rendering mechanism and the high trigger frequency of `MutationObserver`, the callback function of `MutationObserver` may be executed multiple times in a short period, causing the plugin's buttons and lists to be repeatedly added to the page.

**Solution:** Use **Debouncing**.

The debounce function ensures that the callback function is executed after a delay after the event is triggered. If the event is triggered again during this period, the timer is reset. Through debouncing, it can be ensured that the injection operation is performed only once after React rendering is completed, avoiding repeated addition of elements.

**Key Code:**

```javascript
// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Use debouncing to wrap the injection function
const debouncedInjectPinButton = debounce(injectPinButton, 100);
const debouncedInjectPinList = debounce(injectPinList, 100);
```

### Contribution

Welcome to submit issues or pull requests to help improve this plugin!

### License

[MIT License](LICENSE)