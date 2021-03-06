import * as assert from 'assert'
import * as proxyquire from 'proxyquire'
import * as sinon from 'sinon'
import { outputStreams } from '../../src/'

describe('Output - DynamoDB', () => {
  let outStreamInput
  let putSpy
  let deleteSpy
  let updateSpy
  let AwsDynamoDBMock

  beforeEach(() => {
    putSpy = global.sandbox.spy()
    deleteSpy = global.sandbox.spy()
    updateSpy = global.sandbox.spy()

    class DocumentClientMock {
      constructor (config) { }
      put (...args) { putSpy.apply(this, args) }
      delete (...args) { deleteSpy.apply(this, args) }
      update (...args) { updateSpy.apply(this, args) }
    }

    AwsDynamoDBMock = {
      DocumentClient: DocumentClientMock
    }

    const DynamoDBMock = proxyquire('../../src/output-streams/dynamodb', {
      'aws-sdk/clients/dynamodb': AwsDynamoDBMock
    })

    outStreamInput = (new DynamoDBMock()).create()
  })

  describe('PUT operation', () => {
    const exampleParams = {
      my: 'example',
      obj: 'object'
    }
    const examplePutObj = {
      operation: outputStreams.DynamoDB.Operations.PUT,
      params: exampleParams
    } as outputStreams.DynamoDB.Message

    it('performs a put call on aws if we pass a PUT Message', (done) => {
      outStreamInput(examplePutObj)
        .subscribe(...global.baseSubscriber(examplePutObj, done))

      assert(putSpy.called)
      assert(putSpy.getCalls().length === 1)
      assert.equal(putSpy.getCall(0).args[0], exampleParams)

      const callback = putSpy.getCall(0).args[1]
      assert(callback instanceof Function)

      callback(null, {})
    })

    describe('Error handling', () => {
      it('outputs an error if the aws call failed', (done) => {
        const error = new Error('put error message')

        outStreamInput(examplePutObj)
          .subscribe(() => { }, (err) => {
            assert.deepEqual(err, error)
            done()
          })

        assert(putSpy.called)
        assert(putSpy.getCalls().length === 1)
        assert.equal(putSpy.getCall(0).args[0], exampleParams)

        const callback = putSpy.getCall(0).args[1]
        assert(callback instanceof Function)

        callback(error, {})
      })
    })
  })

  describe('DELETE operation', () => {
    const exampleParams = {
      my: 'example',
      obj: 'object'
    }
    const exampleDeleteObj = {
      operation: outputStreams.DynamoDB.Operations.DELETE,
      params: exampleParams
    } as outputStreams.DynamoDB.Message

    it('performs a delete call on aws if we pass a DELETE Message', (done) => {
      outStreamInput(exampleDeleteObj)
        .subscribe(...global.baseSubscriber(exampleDeleteObj, done))

      assert(deleteSpy.called)
      assert(deleteSpy.getCalls().length === 1)
      assert.equal(deleteSpy.getCall(0).args[0], exampleParams)

      const callback = deleteSpy.getCall(0).args[1]
      assert(callback instanceof Function)

      callback(null, {})
    })

    describe('Error handling', () => {
      it('outputs an error if the aws call failed', (done) => {
        const error = new Error('put error message')

        outStreamInput(exampleDeleteObj)
          .subscribe(() => { }, (err) => {
            assert.deepEqual(err, error)
            done()
          })

        assert(deleteSpy.called)
        assert(deleteSpy.getCalls().length === 1)
        assert.equal(deleteSpy.getCall(0).args[0], exampleParams)

        const callback = deleteSpy.getCall(0).args[1]
        assert(callback instanceof Function)

        callback(error, {})
      })
    })
  })

  describe('UPDATE operation', () => {
    const exampleParams = {
      my: 'example',
      obj: 'object'
    }
    const exampleUpdateObj = {
      operation: outputStreams.DynamoDB.Operations.UPDATE,
      params: exampleParams
    } as outputStreams.DynamoDB.Message

    it('performs an update call on aws if we pass an UPDATE Message', (done) => {
      outStreamInput(exampleUpdateObj)
        .subscribe(...global.baseSubscriber(exampleUpdateObj, done))

      assert(updateSpy.called)
      assert(updateSpy.getCalls().length === 1)
      assert.equal(updateSpy.getCall(0).args[0], exampleParams)

      const callback = updateSpy.getCall(0).args[1]
      assert(callback instanceof Function)

      callback(null, {})
    })

    describe('Error handling', () => {
      it('outputs an error if the aws call failed', (done) => {
        const error = new Error('put error message')

        outStreamInput(exampleUpdateObj)
          .subscribe(() => { }, (err) => {
            assert.deepEqual(err, error)
            done()
          })

        assert(updateSpy.called)
        assert(updateSpy.getCalls().length === 1)
        assert.equal(updateSpy.getCall(0).args[0], exampleParams)

        const callback = updateSpy.getCall(0).args[1]
        assert(callback instanceof Function)

        callback(error, {})
      })
    })
  })
})
