import * as c from 'colors/safe'
import { Observable, Subscription as RxjsSubscription } from 'rxjs'
import * as MutatorIO from './mutator-io'
import * as uuidv1 from 'uuid/v1'
import logger from './logger'

export class Subscription {
  id: string
  stream: Observable<any>
  disposable: RxjsSubscription

  constructor (
    private mutatorInstance: MutatorIO,
    private pipeName: string,
    private transformIndex: number
  ) {
    this.id = uuidv1()
  }

  unsubscribe (): void {
    this.mutatorInstance.removeTransformer(this.pipeName, this.transformIndex)
    this.disposable.unsubscribe()
    logger.info(`${c.rainbow('•••')} ${this.pipeName} pipe closed (unsubscribed) ${c.rainbow('•••')}`)
  }
}
