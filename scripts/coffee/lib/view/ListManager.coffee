array = require 'utila/scripts/js/lib/array'
List = require './listManager/List'

module.exports = class ListManager

	constructor: (@view) ->

		@_lists = []

	getAll: ->

		@_lists

	get: (name) ->

		list = @_getListByName name

		unless list?

			@_lists.push list = new List @, name

		list

	_getListByName: (name) ->

		name = String name

		if name.length < 3

			throw Error "Wrong name '#{name}' for a list"

		for list in @_lists

			return list if list.name is name

		return

	_removeList: (list) ->

		array.pluckOneItem @_lists, list

		return