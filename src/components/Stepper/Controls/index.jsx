// @flow
import * as React from 'react'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'

type NextButtonProps = {
  text: string,
  disabled: boolean,
}

const NextButton = ({ text, disabled }: NextButtonProps) => (
  <Button
    variant="raised"
    color="primary"
    type="submit"
    disabled={disabled}
  >
    {text}
  </Button>
)

type GoProps = {
  title: string,
  to: string,
}

const GoButton = ({ title, to }: GoProps) => (
  <Link to={to}>
    <NextButton text={title} disabled={false} />
  </Link>
)

type ControlProps = {
  next: string,
  onPrevious: () => void,
  firstPage: boolean,
  submitting: boolean,
}

const ControlButtons = ({
  next, firstPage, onPrevious, submitting,
}: ControlProps) => (
  <React.Fragment>
    <Button
      type="button"
      disabled={firstPage || submitting}
      onClick={onPrevious}
    >
      Back
    </Button>
    <NextButton text={next} disabled={submitting} />
  </React.Fragment>
)

type Props = {
  finishedTx: boolean,
  onPrevious: () => void,
  firstPage: boolean,
  lastPage: boolean,
  submitting: boolean,
  goTitle: string,
  goPath: string,
}

const Controls = ({
  finishedTx, onPrevious, firstPage, lastPage, submitting, goTitle, goPath,
}: Props) => (
  <React.Fragment>
    { finishedTx
      ? <GoButton title={goTitle} to={goPath} />
      : <ControlButtons
        submitting={submitting}
        next={lastPage ? 'Finish' : 'Next'}
        firstPage={firstPage}
        onPrevious={onPrevious}
      />
    }
  </React.Fragment>
)

export default Controls
