const imap = require('imap-simple');

function lastFiveHours() {
    const delay = 5 * 3600 * 1000;
    const since = new Date();
    since.setTime(Date.now() - delay);
    return since;
}

async function imapFindMatchedPatterns(imapCredentials, subjectRegExp, patternRegExp, sinceDate = lastFiveHours(), debugLogger = console.debug) {
    const connection = await imap.connect({ imap: imapCredentials });
    debugLogger('connected to imap');
    try {
        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN', ['SINCE', sinceDate.toISOString()]];
        const fetchOptions = {
            bodies: ['HEADER.FIELDS (FROM SUBJECT)', 'TEXT'],
            markSeen: true,
        };
        const messages = await connection.search(searchCriteria, fetchOptions);
        debugLogger('loaded messages');
        const patterns = messages
            .filter(_ => subjectRegExp.test(_.parts[0].body.subject[0]))
            .map(_ => patternRegExp.exec(_.parts[1].body))
            .filter(Boolean)
            .map(_ => _[1]);
        if (patterns.length > 0) {
            debugLogger('found patterns');
        } else {
            throw new Error('imap patterns not found');
        }
        return patterns;
    }
    catch(err) {
        throw err;
    }
    finally {
        connection.end();
        debugLogger('imap connection closed');
    }
}

module.exports.imapFindMatchedPatterns = imapFindMatchedPatterns;