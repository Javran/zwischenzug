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

const mkTree = xs => {
  if (!Array.isArray(xs) || xs.length === 0)
    return null

  const {next, isNothing} = (() => {
    let i = 0
    const nothing = {}
    const isNothing = v => v === nothing
    const next = () => {
      if (i >= xs.length)
        return nothing
      const ret = xs[i]
      ++i
      return ret
    }
    return {next, isNothing}
  })()

  const root = new TreeNode(next())
  let currentLevel = [root]
  let nextLevel = []

  while (currentLevel.length > 0) {
    for (let i = 0; i < currentLevel.length; ++i) {
      const lVal = next()
      if (isNothing(lVal))
        return root
      if (lVal && !isNothing(lVal)) {
        const newNode = new TreeNode(lVal)
        currentLevel[i].left = newNode
        nextLevel.push(newNode)
      }
      const rVal = next()
      if (isNothing(rVal))
        return root
      if (rVal && !isNothing(rVal)) {
        const newNode = new TreeNode(rVal)
        currentLevel[i].right = newNode
        nextLevel.push(newNode)
      }
    }
    currentLevel = nextLevel
    nextLevel = []
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

module.exports = {
  TreeNode,
  TreeLinkNode,
  NestedInteger,
  Interval,

  mkTree,
  treeToStr,
  printTree,
  isTreeEqual,

  randomIntGenBetween,
}
