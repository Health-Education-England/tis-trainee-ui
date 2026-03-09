import * as yup from 'yup';
import { formAValidationSchema } from '../form-builder/form-r/part-a-ph/formAValidationSchema';

describe('formAValidationSchema - identifier validation', () => {
  const validBase = {
    forename: 'John',
    surname: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    immigrationStatus: 'Status',
    qualification: 'MBBS',
    dateAttained: '2010-01-01',
    medicalSchool: 'School',
    address1: 'Address 1',
    address2: 'Address 2',
    postCode: '12345',
    telephoneNumber: '01234567890',
    mobileNumber: '01234567890',
    email: 'john.doe@example.com',
    declarationType: 'Declaration',
    programmeSpecialty: 'Specialty',
    cctSpecialty1: 'Specialty1',
    college: 'College',
    completionDate: '2030-01-01',
    trainingGrade: 'Grade',
    startDate: '2020-01-01',
    programmeMembershipType: 'Type',
    wholeTimeEquivalent: '1',
    gmcNumber: '',
    gdcNumber: '',
    publicHealthNumber: ''
  };

  it('fails if all identifiers are blank', async () => {
    await expect(formAValidationSchema.validate(validBase)).rejects.toThrow(
      /At least one of GMC number, GDC number, or Public Health number must be provided/
    );
  });

  it('passes if only gmcNumber is provided', async () => {
    const data = { ...validBase, gmcNumber: '123456', gdcNumber: '', publicHealthNumber: '' };
    await expect(formAValidationSchema.validate(data)).resolves.toBeTruthy();
  });

  it('passes if only gdcNumber is provided', async () => {
    const data = { ...validBase, gmcNumber: '', gdcNumber: '654321', publicHealthNumber: '' };
    await expect(formAValidationSchema.validate(data)).resolves.toBeTruthy();
  });

  it('passes if only publicHealthNumber is provided', async () => {
    const data = { ...validBase, gmcNumber: '', gdcNumber: '', publicHealthNumber: 'PH123' };
    await expect(formAValidationSchema.validate(data)).resolves.toBeTruthy();
  });

  it('passes if multiple identifiers are provided', async () => {
    const data = { ...validBase, gmcNumber: '123', gdcNumber: '456', publicHealthNumber: '789' };
    await expect(formAValidationSchema.validate(data)).resolves.toBeTruthy();
  });

  it('fails if identifiers are only whitespace', async () => {
    const data = { ...validBase, gmcNumber: '   ', gdcNumber: '   ', publicHealthNumber: '   ' };
    await expect(formAValidationSchema.validate(data)).rejects.toThrow(
      /At least one of GMC number, GDC number, or Public Health number must be provided/
    );
  });
});
