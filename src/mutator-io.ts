import * as c from 'colors/safe'
import { Observable, ReplaySubject } from 'rxjs'
import { TransformStream } from './transform-streams'
import { InputStream } from './input-streams'
import { OutputStream } from './output-streams'
import * as shared from './shared'
import Subscription from './subscription'
import logger from './logger'

export interface Pipe {
  name: string,
  in: InputStream,
  out: OutputStream
}

export interface Transformers {
  [name: string]: Array<TransformStream>
}

export type LogLevel = 'NONE' | 'DEBUG' | 'INFO'

export interface Config {
  LOG_LEVEL?: LogLevel
}

export class MutatorIO {
  transformers: Transformers = {}

  constructor (public pipes: Array<Pipe>, public config: Config = {}) {
    logger.level = config.LOG_LEVEL.toLowerCase() || 'info'
  }

  transform (pipeName: string, transform: TransformStream): Subscription {
    this.transformers[pipeName] = this.transformers[pipeName] || []
    this.transformers[pipeName].push(transform)
    return new Subscription(pipeName, this)
  }

  start (): void {
    interface pipeResult extends Array<Object> {
      0: string,
      1: Observable<Object>
    }

    const streams = Object.keys(this.transformers)
      .reduce((acc, pipeName): Array<pipeResult> => {
        const currentPipe = this.pipes.find((pipe) => pipe.name === pipeName)

        const currentPipeResult = this.transformers[pipeName]
          .map((transformer): pipeResult => {
            const inStream = currentPipe.in.create()
            const outStream = currentPipe.out.create()

            return [
              pipeName,
              inStream
                .do((msg) => logger.debug(c.yellow('pre-transformation'), msg))
                .flatMap((msg) => shared.wrapToObservable(transformer.call(this, msg)))
                .do((msg) => logger.debug(c.yellow('post-transformation'), msg))
                .flatMap((msg) => shared.wrapToObservable(outStream(msg))
                  .catch((err) => {
                    logger.error(err)
                    return inStream
                  })
                )
            ]
          })

        return acc.concat(currentPipeResult)
      }, [])

    streams.map(([pipeName, stream]) => {
      logger.info(`${c.rainbow('•••')} Listening on pipe ${pipeName} ${c.rainbow('•••')}`)
      stream
        .subscribe(
          (msg) => logger.info(msg),
          (err) => logger.error(err),
          () => logger.info(`${c.rainbow('•••')} ${pipeName} pipe closed ${c.rainbow('•••')}`)
        )
    })
  }
}
