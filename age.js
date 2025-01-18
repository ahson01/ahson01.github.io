

function calculateAge() {
    const birthday = new Date('2012-01-01'); // Date of birth
    const today = new Date(); 
    let age = today.getFullYear() - birthday.getFullYear(); // Use 'let' instead of 'const'
    
    // If birthday is in the future this year, subtract 1
    if (today.getMonth() < birthday.getMonth() || 
        (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) {
      age--; // Now this modification is allowed
    } 
    
    // Update the element with id "age"
    document.getElementById('age').textContent = "Also, I'm " + age + "..."; 
  }
  
  // Call the function to calculate and display age
  document.addEventListener("DOMContentLoaded", function() {
    calculateAge();
  });