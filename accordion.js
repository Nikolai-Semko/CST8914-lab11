//pseudocode
/*
  1. Grab the accordion buttons from the DOM
  2. go through each accordion button one by one
  3. Use the classlist dom method in combination with the toggle method provided by the DOM to add or remove the "is-open" class. At this point, the accordion button should be able to switch back and forth between its font awesome icons but there is no content inside of it. This is because of the overflow:hidden and the max-height of zero; it is hiding our content. So now we must use javascript to change these values with DOM CSS
  4. get the div that has the content of the accordion button you are currently looking at; we do this using the .nextElementSibling method which allows us to look at the html element that is directly next to the current html element we are looking at. Since we are currently looking at a button (accordion button), the next element after that is the div with the class accordion-content. This is exactly what we want because it allows us to work with the div that has the content that we want to display. Also please note that we could have got to this div in another way but this is the "shortest path" to our answer.
  
  5. set the max-height based on whether the current value of the max-height css property. If the max-height is currently 0 (if the page has just been visited for the first time) or null (if it has been toggled once already) which means that it is closed, you will give it an actual value so the content will be shown; if not then that means the max-height currently has a value and you can set it back to null to close it.
  6. If the accordion is closed we set the max-height of the currently hidden text inside the accordion from 0 to the scroll height of the content inside the accordion. The scroll height refers to the height of an html element in pixels. For this specific example, we are talking about the height of the div with the class accordion-content with all of its nested ptags
*/

const accordionBtns = document.querySelectorAll(".accordion");

// Set initial ARIA states
accordionBtns.forEach((accordion, index) => {
  // Add ARIA attributes
  accordion.setAttribute("aria-expanded", "false");
  
  // Set id for the button if it doesn't have one
  if (!accordion.id) {
    accordion.id = `accordion-${index}`;
  }
  
  // Set id for the content panel and connect it with aria-controls
  const content = accordion.nextElementSibling;
  const contentId = `content-${index}`;
  content.id = contentId;
  
  // Connect the button to its content
  accordion.setAttribute("aria-controls", contentId);
  
  // Set the content panel with appropriate ARIA attributes
  content.setAttribute("role", "region");
  content.setAttribute("aria-labelledby", accordion.id);
});

// Handle click events - preserve original toggle functionality
accordionBtns.forEach((accordion) => {
  accordion.onclick = function () {
    // Toggle the is-open class
    this.classList.toggle("is-open");
    
    // Update ARIA expanded state
    const isExpanded = this.classList.contains("is-open");
    this.setAttribute("aria-expanded", isExpanded);

    // Original content toggle logic
    let content = this.nextElementSibling;
    
    if (content.style.maxHeight) {
      // This is if the accordion is open - close it
      content.style.maxHeight = null;
    } else {
      // If the accordion is currently closed - open it
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };
});

// Add keyboard navigation
document.addEventListener("keydown", function(e) {
  // Check if we're on an accordion button
  if (!e.target.classList.contains("accordion")) {
    return;
  }
  
  const currentIndex = Array.from(accordionBtns).indexOf(e.target);
  let nextIndex;
  
  switch (e.key) {
    case "ArrowDown":
      // Move focus to the next accordion button
      e.preventDefault();
      nextIndex = (currentIndex + 1) % accordionBtns.length;
      accordionBtns[nextIndex].focus();
      break;
    
    case "ArrowUp":
      // Move focus to the previous accordion button
      e.preventDefault();
      nextIndex = (currentIndex - 1 + accordionBtns.length) % accordionBtns.length;
      accordionBtns[nextIndex].focus();
      break;
    
    case "Home":
      // Move focus to the first accordion button
      e.preventDefault();
      accordionBtns[0].focus();
      break;
    
    case "End":
      // Move focus to the last accordion button
      e.preventDefault();
      accordionBtns[accordionBtns.length - 1].focus();
      break;
    
    case "Enter":
    case " ":
      // Toggle the accordion when Enter or Space is pressed
      e.preventDefault();
      e.target.click(); // Use the existing click handler
      break;
  }
});