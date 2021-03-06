const assert = require('assert')

function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

function TreeLinkNode(val) {
  this.val = val
  this.left = this.right = this.next = null
}

function ListNode(val) {
  this.val = val
  this.next = null
}

function NestedInteger(xs) {
  this.xs = xs
}

function Interval(start, end) {
  this.start = start
  this.end = end
}

NestedInteger.prototype.isInteger = function() {
  return !Array.isArray(this.xs)
}

NestedInteger.prototype.getInteger = function() {
  return Array.isArray(this.xs) ? null : this.xs
}

NestedInteger.prototype.getList = function() {
  return Array.isArray(this.xs) ? this.xs.map(x => new NestedInteger(x)) : null
}

function QNode(v) {
  this.v = v
  this.next = null
}

const mkTree = xs => {
  if (!Array.isArray(xs) || xs.length === 0)
    return null

  let i = 0
  const nextItem = () => {
    if (i >= xs.length)
      return null
    const ret = xs[i]
    ++i
    return ret
  }

  const root = new TreeNode(nextItem())
  let qHead = new QNode(root)
  let qTail = qHead
  while (qHead) {
    const cur = qHead.v
    const itemL = nextItem()
    if (itemL !== null) {
      cur.left = new TreeNode(itemL)
      qTail.next = new QNode(cur.left)
      qTail = qTail.next
    }
    const itemR = nextItem()
    if (itemR !== null) {
      cur.right = new TreeNode(itemR)
      qTail.next = new QNode(cur.right)
      qTail = qTail.next
    }
    qHead = qHead.next
  }
  return root
}

const treeToStr = t => {
  if (t === null)
    return "-"
  return `(${treeToStr(t.left)}|${t.val}|${treeToStr(t.right)})`
}

const printTree = t =>
  console.log(treeToStr(t))

// TODO: check printTree(mkTree([3,0,4,null,2,null,null,1]))

const isTreeEqual = (t1, t2) => {
  if (t1 === t2)
    return true
  if (t1 === null || t2 === null)
    return false
  // now we have t1 !== null and t2 !== null
  return t1.val === t2.val &&
    isTreeEqual(t1.left, t2.left) &&
    isTreeEqual(t1.right, t2.right)
}

const randomIntGenBetween = (min, max) => {
  min = Math.ceil(min), max = Math.floor(max)
  const range = max - min + 1
  return () =>
    Math.floor(Math.random() * range) + min
}

/*
   cTestFunc(<func>[, assertEqual = assert.deepStrictEqual])(...input)([expected value])

   you can overwrite assertEqual if you want to customize the way results are compared.
   note that your assertEqual MUST throw an error when the result is unexpected,
   otherwise the result will be ignored

   NOTE: old name is consoleTest, in order not to mess up auto completion of "console.xxxx",
   I figure it's best not to use the same prefix
 */
const cTestFunc = (f, assertEqual = assert.deepStrictEqual) => (...inps) => expected => {
  const timeTag = f.name
  console.time(timeTag)
  const actual = f.apply(null, inps)
  console.timeEnd(timeTag)
  if (typeof expected !== 'undefined') {
    try {
      assertEqual(actual, expected)
    } catch (e) {
      console.error(`[FAILED]`)
      console.error('expected:')
      console.error(expected)
      console.error('actual:')
      console.error(actual)
      if (assertEqual !== assert.deepStrictEqual) {
        console.error(`error:`)
        console.error(e)
      }
    }
  } else {
    console.log(`Result:`)
    console.log(actual)
  }
}

// compat
const consoleTest = cTestFunc

/*
   cTestImpl(<mkFunc>[, assertEqual = assert.deepStrictEqual])
     (<Array of commands>, <Array of argument list>)
     ([expected value])
 */
const cTestImpl =
  (mkFunc, assertEqual = assert.deepStrictEqual) => (cmds, argLists) => expected => {
  const fName = mkFunc.name
  let obj = null
  const ans = []

  console.time(fName)
  for (let i = 0; i < cmds.length; ++i) {
    const cmd = cmds[i]
    if (cmd === fName) {
      obj = new mkFunc(...argLists[i])
      ans.push(null)
    } else {
      const ret = obj[cmd].apply(obj, [...argLists[i]])
      ans.push(ret || null)
    }
  }
  console.timeEnd(fName)
  if (typeof expected !== 'undefined') {
    try {
      assertEqual(ans, expected)
    } catch (e) {
      console.error(`[FAILED]`)
      console.error('expected:')
      console.error(JSON.stringify(expected))
      console.error('actual:')
      console.error(JSON.stringify(ans))
      if (assertEqual !== assert.deepStrictEqual) {
        console.error(`error:`)
        console.error(e)
      }
    }
  } else {
    console.log(`Result:`)
    console.log(JSON.stringify(ans))
  }
}

const mkListNode = xs => {
  const pre = {next: null}
  let cur = pre
  for (let i = 0; i < xs.length; ++i) {
    cur.next = new ListNode(xs[i])
    cur = cur.next
  }
  return pre.next
}

const listNodeToArray = l => {
  const ret = []
  for (let cur = l; cur; cur = cur.next)
    ret.push(cur.val)
  return ret
}

/*
   shorthand for list generation instead of the super verbose randomIntGenBetween.

   - random list of length ranged [1,20], with value being ranged [-10,20]:

     genList({l: 1, r: 20}, {l: -10, r: 20})

   - random list of fixed length 1000, with value being ranged [-10,20]:

     genList(1000, {l: -10, r: 20})

   - (not very) random list of length ranged [1,20], with every value being 10

     genList({l: 1, r: 20}, 10)

   - (not very) random list of fixed length 1000, with every value being 10

     genList(1000, 10)

 */
const genList = (lenRange, valRange) => {
  const gLen =
    typeof lenRange === 'object' ?
      randomIntGenBetween(lenRange.l, lenRange.r) :
      (() => lenRange)
  const g =
    typeof valRange === 'object' ?
      randomIntGenBetween(valRange.l, valRange.r) :
      (() => valRange)
  const sz = gLen()
  const ret = new Array(sz)
  for (let i = 0; i < sz; ++i)
    ret[i] = g()
  return ret
}

/*
   shorthand for generating a random integer instead using the super verbose randomIntGenBetween
 */
const genInt = (l, r) => randomIntGenBetween(l,r)()

module.exports = {
  TreeNode,
  TreeLinkNode,
  NestedInteger,
  Interval,
  ListNode,
  mkListNode,
  listNodeToArray,

  mkTree,
  treeToStr,
  printTree,
  isTreeEqual,

  randomIntGenBetween,

  consoleTest,
  cTestFunc,
  cTestImpl,

  genList,
  genInt,
}
