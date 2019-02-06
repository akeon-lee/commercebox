/**
 * @overview: This component is the search bar for the application. It can simple be placed in any other component to search that specific
 * part of the component.
 */

import React, { Component } from 'react'
import _ from 'lodash'

// Semantic UI
import { Search } from 'semantic-ui-react'

export default class SearchBar extends Component {
    state = {
        isLoading: false, // use the global isLoading component
        results: [],
        value: ''
    }

    componentDidMount = () => {
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = async (e, { value }) => {
        await this.setState({ isLoading: true, value })

        if (this.state.value.length < 1) return this.resetComponent()

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = result => re.test(result.title)

        this.setState({
            isLoading: false,
            results: _.filter(this.props.inventory, isMatch),
        })
    }

    render() {
        const { isLoading, value, results } = this.state

        return (
            <Search
                loading={isLoading}
                placeholder='Search...'
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={results}
                value={value}
                {...this.props}
            />
        )
    }
}

/**
 *  @overview: This gives us a full example of how the search works
 *  @import `Grid, Header, Segment` import these to semantic-ui-react for this to work
 *
    <Grid>
        <Grid.Column width={6}>
            <Search
                loading={isLoading}
                placeholder='Search...'
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={results}
                value={value}
                {...this.props}
            />
        </Grid.Column>
        <Grid.Column width={10}>
            <Segment>
                <Header>State</Header>
                <pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state, null, 2)}</pre>
                <Header>Options</Header>
                <pre style={{ overflowX: 'auto' }}>{JSON.stringify(source, null, 2)}</pre>
            </Segment>
        </Grid.Column>
    </Grid>
 *
 */