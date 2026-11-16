const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('js/todo.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const template = html.match(/id="tpl">([\s\S]*?)<\/script>/)[1];
const elements = new Map();
let ready, saved = null, prompts = [], alerts = [];
const input = name => ({value: '',focus(){},name});
const fields = {date:input('date'),title:input('title'),content:input('content')};
function element(id) {
 if (!elements.has(id)) elements.set(id, {innerHTML:'',textContent:'',disabled:false,handlers:{},addEventListener(type,fn){this.handlers[type]=fn;}});
 return elements.get(id);
}
element('tpl').innerHTML = template;
element('frmTodo').elements = {namedItem: name => fields[name]};
const context = vm.createContext({Date, String, Number, JSON, Array,
 document:{getElementById:element,querySelectorAll:()=>[]},
 window:{addEventListener:(type,fn)=>{ready=fn;}},
 localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value;}},
 prompt:()=>prompts.shift(),confirm:()=>true,alert:x=>alerts.push(x)});
vm.runInContext(source+'\nthis.app=todo;',context);
ready();
const app=context.app;
function check(name, fn){fn();console.log('PASS '+name);}
check('빈 목록 초기화',()=>assert.equal(app.items.length,0));
check('추가 및 조회',()=>{app.add('2026-11-16','과제 준비','기존 자료 확인');assert.equal(app.items.length,1);assert.match(element('todo-items').innerHTML,/과제 준비/);});
let uid=app.items[0].uid;
check('수정 및 저장',()=>{prompts=['제출 검증','시연 준비'];app.edit(uid);assert.equal(app.items[0].title,'제출 검증');assert.match(saved,/시연 준비/);});
check('수정 취소',()=>{prompts=[null];app.edit(uid);assert.equal(app.items[0].title,'제출 검증');});
check('완료 및 필터',()=>{app.toggle(uid);app.filter='active';app.render();assert.match(element('todo-items').innerHTML,/No tasks yet/);app.filter='completed';app.render();assert.match(element('todo-items').innerHTML,/제출 검증/);});
check('저장 데이터 복원',()=>{app.items=[];ready();assert.equal(app.items.length,1);});
check('삭제',()=>{app.remove(uid);assert.equal(app.items.length,0);});
check('빈 입력 거부',()=>{element('frmTodo').handlers.submit({preventDefault(){}});assert.equal(alerts.length,1);assert.equal(app.items.length,0);});
check('입력 HTML 안전 표시',()=>{app.filter='all';app.add('2026-11-16','<img src=x onerror=alert(1)>','$& <b>내용</b>');assert.ok(!element('todo-items').innerHTML.includes('<img'));assert.match(element('todo-items').innerHTML,/&lt;img/);assert.match(element('todo-items').innerHTML,/\$&amp;/);});
check('손상된 저장 데이터 처리',()=>{saved='{broken';ready();assert.equal(app.items.length,0);});
console.log('10 checks passed. DOM mock unit tests; not browser E2E.');
