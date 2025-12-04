# Contributing to MediCore EMR

Thank you for your interest in contributing to MediCore EMR! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/vaibhaviimcal-web/medicore-emr-v2/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear use case
   - Expected behavior
   - Mockups or examples if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
   
   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `style:` Formatting
   - `refactor:` Code restructuring
   - `test:` Adding tests
   - `chore:` Maintenance

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Add screenshots for UI changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/medicore-emr-v2.git
cd medicore-emr-v2

# Add upstream remote
git remote add upstream https://github.com/vaibhaviimcal-web/medicore-emr-v2.git

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Setup environment
cp .env.example .env

# Start development
npm run dev
```

## Code Style

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions

### React Components
```typescript
// Good
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  )
}
```

### API Endpoints
```typescript
// Good
router.post('/patients', authenticate, authorize(['DOCTOR']), async (req, res) => {
  try {
    const patient = await createPatient(req.body)
    res.status(201).json({ success: true, data: patient })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
```

## Testing

### Running Tests
```bash
# All tests
npm test

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Writing Tests
```typescript
// Example test
describe('Patient API', () => {
  it('should create a new patient', async () => {
    const patient = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+911234567890',
      dateOfBirth: '1990-01-01',
      gender: 'MALE'
    }
    
    const response = await request(app)
      .post('/api/patients')
      .send(patient)
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.firstName).toBe('John')
  })
})
```

## Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API documentation
- Include examples in docs

## Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Testing in staging environment
4. Approval and merge

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- GitHub Discussions
- Email: dev@medicore-emr.com
- Slack: medicore-emr.slack.com

Thank you for contributing! 🎉
