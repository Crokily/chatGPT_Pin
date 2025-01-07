(function() {
  // Function to create and inject the pin button
  function createPinButton() {
    const pinButton = document.createElement('button');
    // pinButton.innerHTML = '📌 Pin'; 

    // 检查当前聊天是否已固定
    const chatUrl = window.location.href;

    // 如果当前页面不是聊天页面（即直接以.com/结尾的页面），则不显示Pin按钮
    if (chatUrl.endsWith('.com/')) {
      return
    }

    chrome.storage.local.get(['pinnedChats'], function(result) {
      const pinnedChats = result.pinnedChats || [];
      const isPinned = pinnedChats.some((c) => c.url === chatUrl);
      // pinButton.innerHTML = isPinned ? 'Unpin' : 'Pin';
      if (!isPinned) {
        pinButton.innerHTML = `
        <div class="flex w-full items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32">
            <path fill="currentColor" d="M22.15 3.237c-1.93-1.93-5.185-1.403-6.406 1.04l-3.175 6.35a1.5 1.5 0 0 1-.868.752L6.72 13.04a2 2 0 0 0-.782 3.312l4.149 4.149L4 26.586v1.415h1.414l6.086-6.086l4.149 4.149a2 2 0 0 0 3.311-.782l1.661-4.983a1.5 1.5 0 0 1 .752-.867l6.351-3.175c2.442-1.222 2.97-4.476 1.04-6.407zM17.533 5.17a2 2 0 0 1 3.203-.52l6.614 6.614a2 2 0 0 1-.52 3.203l-6.351 3.175a3.5 3.5 0 0 0-1.755 2.024l-1.661 4.982l-9.712-9.711l4.983-1.661a3.5 3.5 0 0 0 2.024-1.755z"/>
          </svg> 
        Pin
        </div>
        `;
        pinButton.classList.add('pin-button', 'btn', 'btn-secondary', 'text-token-text-primary');
        pinButton.setAttribute('aria-label', 'Pin Chat');
        pinButton.setAttribute('data-testid', 'pin-chat-button');
      } else {
        pinButton.innerHTML = `
        <div class="flex w-full items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32">
            <path fill="currentColor" d="M22.15 3.237c-1.93-1.93-5.185-1.403-6.406 1.04l-3.175 6.35a1.5 1.5 0 0 1-.868.752L6.72 13.04a2 2 0 0 0-.782 3.312l4.149 4.149L4 26.586v1.415h1.414l6.086-6.086l4.149 4.149a2 2 0 0 0 3.311-.782l1.661-4.983a1.5 1.5 0 0 1 .752-.867l6.351-3.175c2.442-1.222 2.97-4.476 1.04-6.407zM17.533 5.17a2 2 0 0 1 3.203-.52l6.614 6.614a2 2 0 0 1-.52 3.203l-6.351 3.175a3.5 3.5 0 0 0-1.755 2.024l-1.661 4.982l-9.712-9.711l4.983-1.661a3.5 3.5 0 0 0 2.024-1.755z"/>
          </svg>
        Unpin
        </div>
        `;
        pinButton.classList.add('pin-button', 'btn', 'btn-secondary', 'text-token-text-primary');
        pinButton.setAttribute('aria-label', 'Unpin Chat');
        pinButton.setAttribute('data-testid', 'unpin-chat-button');
      }
    }
    );
  
    pinButton.addEventListener('click', function() {
      // 切换聊天固定状态
      togglePinChat();
    });

    return pinButton;
  }

  function createPinList() {
    const pinnedSection = document.createElement('div');
    pinnedSection.className = 'relative mt-5 first:mt-0 last:mb-5';
    pinnedSection.innerHTML = `
      <div class="sticky top-0 z-20">
        <span class="flex h-9 items-center">
          <h3 class="px-2 text-xs font-semibold">Pin</h3>
        </span>
      </div>
      <ol style="list-style-type: none; padding: 0; margin: 0;" id="pinned-conversations-list">
      </ol>
    `;
    return pinnedSection;
  }

  function createPinItem(conversation) {
    const pinItem = document.createElement('div');
    const template = `
      <div class="relative conversation-item">
        <a class="flex p-2" href="${conversation.url}">
          <div title="${conversation.title}">${conversation.title}
          </div>
        </a>
      </div>
    `;
    pinItem.innerHTML = template;
    return pinItem;
  }

  // Function to toggle chat pinning
  function togglePinChat() {
    // 获取该聊天地址和标题，整理成对象，存入localStorage的pinnedChats中
    const chatUrl = window.location.href;
    const chatTitle = document.title;
    const chat = { url: chatUrl, title: chatTitle };
    console.log(chat);

    chrome.storage.local.get(['pinnedChats'], function(result) {
      let pinnedChats = result.pinnedChats || []; // 如果没有pinnedChats，则初始化为空数组
      const chatIndex = pinnedChats.findIndex((c) => c.url === chat.url); // 查找聊天是否已固定
      if (chatIndex === -1) {
        pinnedChats.push(chat);
        console.log('pinned');
      } else {
        pinnedChats.splice(chatIndex, 1); // 如果已固定，则取消固定
        console.log('unpinned');
      }
      chrome.storage.local.set({ pinnedChats });
      console.log(pinnedChats);
    }
    );
  }

  function updatePinList() {
    console.log('updatePinList');
    const pinnedList = document.getElementById('pinned-conversations-list');
    if (!pinnedList) return;
    console.log('pinnedList', pinnedList);
    pinnedList.innerHTML = ``;

    chrome.storage.local.get(['pinnedChats'], function(result) {
      console.log('Value currently is ', result.pinnedChats);
      const pinnedChats = result.pinnedChats || [];
      pinnedChats.forEach((chat) => {
        pinnedList.appendChild(createPinItem(chat));
      });
    });
  }

  function updatePinButton() {
    const pinButton = document.querySelector('.pin-button');
    if (!pinButton) return;
    const chatUrl = window.location.href;
    chrome.storage.local.get(['pinnedChats'], function(result) {
      const pinnedChats = result.pinnedChats || [];
      const isPinned = pinnedChats.some((c) => c.url === chatUrl);
      // pinButton.innerHTML = isPinned ? 'Unpin' : 'Pin';

      if (!isPinned) {
          pinButton.innerHTML = `
          <div class="flex w-full items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32">
              <path fill="currentColor" d="M22.15 3.237c-1.93-1.93-5.185-1.403-6.406 1.04l-3.175 6.35a1.5 1.5 0 0 1-.868.752L6.72 13.04a2 2 0 0 0-.782 3.312l4.149 4.149L4 26.586v1.415h1.414l6.086-6.086l4.149 4.149a2 2 0 0 0 3.311-.782l1.661-4.983a1.5 1.5 0 0 1 .752-.867l6.351-3.175c2.442-1.222 2.97-4.476 1.04-6.407zM17.533 5.17a2 2 0 0 1 3.203-.52l6.614 6.614a2 2 0 0 1-.52 3.203l-6.351 3.175a3.5 3.5 0 0 0-1.755 2.024l-1.661 4.982l-9.712-9.711l4.983-1.661a3.5 3.5 0 0 0 2.024-1.755z"/>
            </svg> 
          Pin
          </div>
        `;
        pinButton.classList.add('pin-button', 'btn', 'btn-secondary', 'text-token-text-primary');
        pinButton.setAttribute('aria-label', 'Pin Chat');
        pinButton.setAttribute('data-testid', 'pin-chat-button');
      } else {
        pinButton.innerHTML = `
          <div class="flex w-full items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32">
              <path fill="currentColor" d="M22.15 3.237c-1.93-1.93-5.185-1.403-6.406 1.04l-3.175 6.35a1.5 1.5 0 0 1-.868.752L6.72 13.04a2 2 0 0 0-.782 3.312l4.149 4.149L4 26.586v1.415h1.414l6.086-6.086l4.149 4.149a2 2 0 0 0 3.311-.782l1.661-4.983a1.5 1.5 0 0 1 .752-.867l6.351-3.175c2.442-1.222 2.97-4.476 1.04-6.407zM17.533 5.17a2 2 0 0 1 3.203-.52l6.614 6.614a2 2 0 0 1-.52 3.203l-6.351 3.175a3.5 3.5 0 0 0-1.755 2.024l-1.661 4.982l-9.712-9.711l4.983-1.661a3.5 3.5 0 0 0 2.024-1.755z"/>
            </svg>
          Unpin
          </div>
        `;
        pinButton.classList.add('pin-button', 'btn', 'btn-secondary', 'text-token-text-primary');
        pinButton.setAttribute('aria-label', 'Unpin Chat');
        pinButton.setAttribute('data-testid', 'unpin-chat-button');
      }
    });
  }

  // 在页面加载后注入Pin按钮
  function injectPinButton() {
      const targetContainer = document.querySelector('.gap-2.flex.items-center.pr-1.leading-\\[0\\]');
      if (targetContainer && !targetContainer.querySelector('.pin-button')) {
        const pinButton = createPinButton();
        // targetContainer.insertBefore(pinButton, targetContainer.lastElementChild);
        if (targetContainer.lastElementChild) {
          targetContainer.insertBefore(pinButton, targetContainer.lastElementChild);
        } else {
          targetContainer.appendChild(pinButton);
        }
      }
  }

  function injectPinList() {
      const targetContainer = document.querySelector('.relative.mt-5.first\\:mt-0.last\\:mb-5')
      if (targetContainer) {
        const parentContainer = targetContainer.parentElement;
        // 创建Pin列表
        if (parentContainer && !parentContainer.querySelector('#pinned-conversations-list')) { 
          const pinList = createPinList();
          // 选择pinList中的ol元素
          const pinListOl = pinList.querySelector('ol');
        
          // 将异步操作放在 Promise 中处理
          chrome.storage.local.get(['pinnedChats'], function(result) {
            console.log('Value currently is ', result.pinnedChats);
            const pinnedChats = result.pinnedChats || [];
            console.log('pinnedChats', pinnedChats);

            // 在获取到数据后再执行 forEach
            pinnedChats.forEach((chat) => {
                console.log('chat', chat);
                const pinItem = createPinItem(chat);
                pinListOl.appendChild(pinItem);
            });

            // 在处理完列表项后再插入到 DOM
            parentContainer.insertBefore(pinList, targetContainer);
          });
        }
      }
  }
    
 
  // 防抖函数
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const debouncedInjectPinButton = debounce(injectPinButton, 100);
  const debouncedInjectPinList = debounce(injectPinList, 100);

  // 页面加载后执行
  function init() {
    // 目标容器的选择器
    const buttonContainerSelector = '.gap-2.flex.items-center.pr-1.leading-\\[0\\]';
    const listContainerSelector = '.relative.mt-5.first\\:mt-0.last\\:mb-5';

    // 创建 MutationObserver 实例
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // 检查是否有节点添加或删除
          if (document.querySelector(buttonContainerSelector)) {
            debouncedInjectPinButton();
          }
          if (document.querySelector(listContainerSelector)) {
            debouncedInjectPinList();
          }
        }
      }
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 目标节点的父节点，我们需要观察整个 body 的变化，因为 React 可能会替换整个内容区域
    const targetNode = document.body;

    // 开始观察
    observer.observe(targetNode, config);

    // 初始注入，确保页面加载时就存在按钮和列表
    injectPinButton();
    injectPinList();

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.pinnedChats) {
        updatePinList();
        updatePinButton();
      }
    });
  }

  init();
})();