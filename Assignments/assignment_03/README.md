## Assignment 3 - Using CSS Grid Layout

### Overview
Apply CSS Grid to the code from http://terrywgriffin.com/lessons/lesson_11/. Instead of using the table to display the colors from colors.json data, use the CSS Grid to displays the colors in something other than a table with one color per row.
### Snippet Code

Basic CSS Grid Layout
```
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /*create 3 columns take up the same amount of space*/
    grid-template-rows: auto;
    grid-gap: 3rem;
}
```

Color Contrast function from  https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area

### Results
- [x] Display colors in multiple rows of 3 with same size. 
- [x] Display background color for each block.
- [x] Display colors' information for each block when hover
<img width="400" alt="Screen Shot 2019-07-14 at 12 00 22 AM" src="https://user-images.githubusercontent.com/24967218/61179585-fdb53980-a5ca-11e9-939d-de1ee3e3264c.png">

- [x] Makes changes in server sides
- [x] Push changes to GitHub Repo