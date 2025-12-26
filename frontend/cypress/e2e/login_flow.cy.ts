describe('Login Flow', () => {
    it('should display login page', () => {
        cy.visit('/login');
        cy.contains('h1', 'Iniciar Sesión');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Ingresar');
    });

    it('should show error with invalid credentials', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('invalid@user.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // Since we don't have a real backend/firebase connected in this environment yet, 
        // we expect the error alert to appear (handled by catch block in component)
        cy.contains('Error al iniciar sesión').should('be.visible');
    });

    it('should redirect to login if accessing protected route', () => {
        cy.visit('/');
        cy.url().should('include', '/login');
    });
});
