export function expEach(context: any[], options: any) {
    let ret = '';
    for (let i = 0, j = context.length; i < j; i++) {
        if (i === j - 1) {
            ret = ret + '<div class="job last">' + options.fn(context[i]) + '</div>';
        } else {
            ret = ret + '<div class="job">' + options.fn(context[i]) + '</div>';
        }
        
    }

    return ret;
}

export function edEach(context: any[], options: any) {
    let ret = '';
    for (let i = 0, j = context.length; i < j; i++) {
        ret = ret + options.fn(context[i]);
    }

    return ret;
}