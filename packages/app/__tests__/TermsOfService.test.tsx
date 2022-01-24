import { screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'

import TermsOfService from '../pages/terms-of-service'
import { LANDING_PAGE_LINK, TOS_PAGE_LINK } from '../utils'
import { assertButtonNotDisabled, findAndClickButton, renderWithTheme } from './helpers'

jest.mock('next/dist/client/router', () => require('next-router-mock'))

describe('Terms of service page', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl(TOS_PAGE_LINK)
  })

  it('displays content', async () => {
    renderWithTheme(<TermsOfService />)

    await screen.findByText('Terms of service')
    assertButtonNotDisabled('Back to Main Page')
  })

  it('redirects to landing page on button click', async () => {
    renderWithTheme(<TermsOfService />)
    expect(mockRouter).toMatchObject({ asPath: TOS_PAGE_LINK })

    await findAndClickButton('Back to Main Page')
    expect(mockRouter).toMatchObject({ asPath: LANDING_PAGE_LINK })
  })
})
