# Design System

## Structural Components

### Header
- Background color: #4682B4
- Font color: white
- Padding: 1em
- Box shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
- Flexbox layout for spacing between elements

### Main
- Padding: 2em

### Scoreboard
- Header font color: #4682B4
- Margin bottom: 1em
- Table width: 100%
- Max table width: 600px
- Table margin: 0 auto
- Table border-collapse: collapse
- Table cell padding: 0.5em
- Table cell border: 1px solid #4682B4
- Text align left for table cells

### Dice Area
- Display: flex
- Justify-content: center
- Margin: 2em 0

### Dice
- Size: 60px by 60px
- Background color: white
- Border: 2px solid #4682B4
- Margin: 0 10px
- Display: flex
- Align-items: center
- Justify-content: center
- Font size: 24px
- Cursor: pointer
- Border radius: 10%
- Transition: transform 0.2s, box-shadow 0.2s

### Dice (Hover)
- Transform: scale(1.1)
- Box shadow: 0 4px 8px rgba(0, 0, 0, 0.2)

### Dice (Selected)
- Background color: #87CEEB
- Border color: #4169E1

### Button
- Padding: 12px 24px
- Font size: 18px
- Cursor: pointer
- Background color: #4682B4
- Font color: white
- Border: none
- Border radius: 5px
- Transition: background-color 0.3s, transform 0.3s
- Margin: 10px

### Button (Hover)
- Background color: #4169E1
- Transform: scale(1.05)

### Button (Disabled)
- Background color: #ccc
- Cursor: not-allowed

### Popup
- Display: none
- Position: fixed
- Top: 50%
- Left: 50%
- Transform: translate(-50%, -50%)
- Background color: white
- Padding: 2em
- Border: 2px solid #4682B4
- Box shadow: 0 4px 8px rgba(0, 0, 0, 0.2)
- Z-index: 1000

### Overlay
- Display: none
- Position: fixed
- Top: 0
- Left: 0
- Width: 100%
- Height: 100%
- Background color: rgba(0, 0, 0, 0.5)
- Z-index: 999

## Colour Palette
- Primary color: #4682B4
- Accent color: #4169E1
- Background color: #F0FFFF
- Dice selected background color: #87CEEB
- Dice selected border color: #4169E1
- Star color: #00008B

## Fonts
- Font family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Header font size: 2.5em
- Scoreboard header font size: 2em
- Dice font size: 24px
- Button font size: 18px
