const GET_USERS = `
    select 
        user_id,
        user_name,
        user_contact,
        user_created_at
    from users
    where 
        user_name ilike concat('%', $3::varchar, '%') or
        user_contact ilike concat('%', $3::varchar)
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then user_created_at
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then user_created_at
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then user_name
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then user_name
    end asc
    offset $1 limit $2
`

const GET_USER = `
    select 
        user_id,
        user_name,
        user_contact,
        user_created_at
    from users
    where user_id::varchar = $1
`

export default {
    GET_USERS,
    GET_USER
}