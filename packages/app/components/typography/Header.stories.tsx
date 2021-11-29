import { Header } from './Header'

const Default = {
  component: Header,
  title: 'Components/Typography/Header',
  parameters: {
    backgrounds: {
      default: 'trueGray',
      values: [
        { name: 'trueGray', value: '#262626' }
      ]
    }
  }
}

export default Default

export const Base = (): JSX.Element => <Header>Header text</Header>
