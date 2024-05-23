import React from "react";
import { usePotatoes } from "../providers/PotatoesProvider";
import { Track } from "../utils/interfaces";

const renderAlbum = (track: Track) => (
    <img src={track.imageUrl} width={40} alt='Album' />
)

const PlaylistData = () => {
    const { playlist = [], playlistLoading } = usePotatoes();

    const columns = [{
        key: 'id',
        name: 'ID',
        width: 80,
        main: true,
    }, {
        key: 'album',
        name: 'Album',
        width: 40,
        render: renderAlbum
    }, {
        key: 'name',
        name: 'Name',
        width: 200,
    }, {
        key: 'album',
        name: 'Album',
        width: 200,
    },{
        key: 'number',
        name: 'Track',
        width: 200,
    },{
        key: 'artist',
        name: 'Artist',
        width: 200,
    }, {
        key: 'date',
        name: 'Date',
        width: 200,
    }, {
        key: 'status',
        name: 'Status',
        width: 200,
    },
    ];

    const renderRow = (track: Track): any => {
        return (
            <tr>
                {columns.map((column) => {
                    if (column.render) {
                        return column.render(track);
                    }
                    if (column.main) {
                        return (<th scope="row">{track[column.key]}</th>)
                    }
                    return (<td>{track[column.key]}</td>)
                })}
            </tr>
        )
    }

    return (
        <>
            {playlistLoading && <div className="loader"/>}
            {!playlistLoading && (
                <table id='PlaylistData'>
                    <caption >
                        Track list
                    </caption>
                    <thead>
                        <tr>
                            {columns.map((column) => <th scope="col" id={column.key}>{column.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {playlist.map((track) => {
                            return renderRow(track);
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th scope="row" colSpan={columns.length - 1}>Count :</th>
                            <td>{playlist.length}</td>
                        </tr>
                    </tfoot>
                </table>
            )}
        </>
    )
}

export default PlaylistData;