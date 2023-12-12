import { getLayout, Layout } from "./Layout"


test('Layout.getLayout', () => {
   const result = getLayout(Layout.RECTANGLE, 10)
    expect(result).toBeDefined()
})

test('Layout.getLayout', () => {
    const result = getLayout(Layout.RECTANGLE, 12)
     expect(result).toBeDefined()
 })

 test('Layout.getLayout', () => {
    const result = getLayout(Layout.RECTANGLE, 16)
     expect(result).toBeDefined()
 })