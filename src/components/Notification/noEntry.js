import { copyTextToClipboard } from '../../utils/functions'

export const copyCurrentPath = () => {
  const {pathname} = window.location
  copyTextToClipboard({
    plainText: pathname
  })
}
export const openGoogleSheet = () => {
  window.open('https://docs.google.com/spreadsheets/d/10FOKgHVoaPHmzniwOwk9Qtf4QCQT3YrhRZ9TUn-vets/edit#gid=0')
}