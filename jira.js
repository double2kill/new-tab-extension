var copyCommitInfo = () => {
    const jiraIdElement = document.querySelector('#issue-content a#key-val')
    const jiraTitleElement = document.querySelector('#issue-content h1#summary-val')

    const jiraIdText = jiraIdElement && jiraIdElement.text
    const jiraTitleText = jiraTitleElement && jiraTitleElement.innerText

    const commitText = `${jiraIdText} ${jiraTitleText}`;
    return commitText
}

var copyButton = document.createElement("div")

var svg = '<svg t="1600058189079" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1854" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M969.152 219.424q22.848 0 38.848 16t16 38.848l0 694.848q0 22.848-16 38.848t-38.848 16l-548.576 0q-22.848 0-38.848-16t-16-38.848l0-164.576-310.848 0q-22.848 0-38.848-16t-16-38.848l0-384q0-22.848 11.424-50.272t27.424-43.424l233.152-233.152q16-16 43.424-27.424t50.272-11.424l237.728 0q22.848 0 38.848 16t16 38.848l0 187.424q38.848-22.848 73.152-22.848l237.728 0zM658.272 341.152l-170.848 170.848 170.848 0 0-170.848zM292.576 121.728l-170.848 170.848 170.848 0 0-170.848zM404.576 491.424l180.576-180.576 0-237.728-219.424 0 0 237.728q0 22.848-16 38.848t-38.848 16l-237.728 0 0 365.728 292.576 0 0-146.272q0-22.848 11.424-50.272t27.424-43.424zM950.848 950.848l0-658.272-219.424 0 0 237.728q0 22.848-16 38.848t-38.848 16l-237.728 0 0 365.728 512 0z" p-id="1855" fill="#ffffff"></path></svg>'
var buttonText = svg + '<span class="space"> </span>' + '复制 commit 信息'
copyButton.id = 'jira-extension-copy'
copyButton.className = 'ant-btn ant-btn-primary'
copyButton.innerHTML = buttonText

var headerElement = document.querySelector('#issue-content .aui-page-header-main')
if (headerElement) {
    headerElement.appendChild(copyButton)
}

$("body").append(`<div id="draggable"><div id="jira-extension-copy_fixed" class="ant-btn ant-btn-primary">${buttonText}</div></div>`);
$('#draggable').draggable();

const copyText = function (trigger) {
    const text = copyCommitInfo();
    if (text.includes('null')) {
        throw new Error()
    }
    $.growl.notice({ title: "复制成功", message: text, size: 'large', duration: 1500 });
    return text
}

new ClipboardJS('#jira-extension-copy', {
    text: copyText
})

new ClipboardJS('#jira-extension-copy_fixed', {
    text: copyText 
})