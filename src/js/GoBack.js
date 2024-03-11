function GoBack(parentContainer) {
    // Properties
    this.parentContainer = parentContainer;
    this.disableCookies = false;
    this.history = [];

    // Create the <p> element dynamically
    this.goBack = document.createElement('p');
    this.goBack.id = 'goBack';
    this.goBack.innerHTML = 'Tillbaka';

    this.createGoBack = function (current, method, element, ...args) {
        // Append the goBack element to the parent container
        this.parentContainer.appendChild(this.goBack);

        // If a clickHandler already exists, remove it
        if (this.clickHandler) {
            this.goBack.removeEventListener('click', this.clickHandler);
        }

        // Return a new Promise that resolves when the new page has been created
        return new Promise(resolve => {
            // Define the click event handler
            this.clickHandler = () => {
                this.disableCookies = true;

                // Remove the goBack element first
                this.goBack.remove();

                // Pop the last page from the history stack and store it in a variable
                var lastPage = this.history.pop();

                // Remove the current page from DOM
                if (lastPage && lastPage.element) {
                    lastPage.element.remove();
                }

                if (lastPage) {
                    // Check if the method to recreate the page is a function
                    if (typeof lastPage.page[lastPage.method] === 'function') {
                        // Recreate the page
                        lastPage.page[lastPage.method](...lastPage.args);
                    }
                }

                // Resolve the Promise
                resolve();
            };

            // Add the new click event listener
            this.goBack.addEventListener('click', this.clickHandler);

            // Add the current page to the history stack
            this.history.push({ page: current, method: method, element: element, args: args });
        });
    };
}