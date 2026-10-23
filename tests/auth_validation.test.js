import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Customer Authentication Validation Rules', () => {
  const validateRegistration = ({ name, email, phone, password, confirmPassword }) => {
    const errors = {};

    if (!name || !name.trim()) {
      errors.name = 'Please enter your full name.';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    let cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.slice(1);
    }
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitized: {
        name: name ? name.trim() : '',
        email: email ? email.trim().toLowerCase() : '',
        phone: cleanPhone,
      },
    };
  };

  it('accepts valid registration input', () => {
    const res = validateRegistration({
      name: 'Ramesh Patel',
      email: 'Ramesh.Patel@example.com',
      phone: '+91 98765 43210',
      password: 'mypassword123',
      confirmPassword: 'mypassword123',
    });

    assert.equal(res.isValid, true);
    assert.equal(res.sanitized.email, 'ramesh.patel@example.com');
    assert.equal(res.sanitized.phone, '9876543210');
  });

  it('rejects passwords shorter than 6 characters', () => {
    const res = validateRegistration({
      name: 'Test',
      email: 'test@example.com',
      phone: '9876543210',
      password: '123',
      confirmPassword: '123',
    });

    assert.equal(res.isValid, false);
    assert.ok(res.errors.password);
  });

  it('rejects mismatched password and confirmPassword', () => {
    const res = validateRegistration({
      name: 'Test',
      email: 'test@example.com',
      phone: '9876543210',
      password: 'passwordA',
      confirmPassword: 'passwordB',
    });

    assert.equal(res.isValid, false);
    assert.ok(res.errors.confirmPassword);
  });

  it('rejects invalid or non-10 digit Indian mobile numbers', () => {
    const res = validateRegistration({
      name: 'Test',
      email: 'test@example.com',
      phone: '12345',
      password: 'password123',
      confirmPassword: 'password123',
    });

    assert.equal(res.isValid, false);
    assert.ok(res.errors.phone);
  });
});
